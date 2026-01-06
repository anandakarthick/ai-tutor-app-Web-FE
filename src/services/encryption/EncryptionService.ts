/**
 * End-to-End Encryption Service for Web
 * Uses TweetNaCl for encryption/decryption
 */

import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

// Storage keys for encryption
const ENCRYPTION_KEYS = {
  KEY_PAIR: 'e2e_key_pair',
  SERVER_PUBLIC_KEY: 'e2e_server_public_key',
  SESSION_KEY: 'e2e_session_key',
};

interface KeyPair {
  publicKey: string; // Base64 encoded
  secretKey: string; // Base64 encoded
}

interface EncryptedPayload {
  ciphertext: string; // Base64 encoded
  nonce: string; // Base64 encoded
  publicKey: string; // Sender's public key (Base64)
}

class EncryptionService {
  private static instance: EncryptionService;
  private keyPair: { publicKey: Uint8Array; secretKey: Uint8Array } | null = null;
  private serverPublicKey: Uint8Array | null = null;
  private sessionKey: Uint8Array | null = null;
  private isInitialized = false;
  private initError: Error | null = null;

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize encryption service
   * Loads or generates key pair
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔐 Initializing E2E Encryption...');

      // Try to load existing key pair
      const storedKeyPair = this.loadKeyPair();
      
      if (storedKeyPair) {
        this.keyPair = {
          publicKey: naclUtil.decodeBase64(storedKeyPair.publicKey),
          secretKey: naclUtil.decodeBase64(storedKeyPair.secretKey),
        };
        console.log('🔐 Loaded existing key pair');
      } else {
        // Generate new key pair
        this.keyPair = nacl.box.keyPair();
        this.saveKeyPair();
        console.log('🔐 Generated new key pair');
      }

      // Load server public key if available
      this.loadServerPublicKey();

      this.isInitialized = true;
      console.log('✅ E2E Encryption initialized');
    } catch (error) {
      console.error('❌ Failed to initialize encryption:', error);
      this.initError = error as Error;
      // Don't throw - let app continue without encryption
    }
  }

  /**
   * Get the client's public key (to send to server)
   */
  getPublicKey(): string {
    if (!this.keyPair) {
      throw new Error('Encryption not initialized');
    }
    return naclUtil.encodeBase64(this.keyPair.publicKey);
  }

  /**
   * Set the server's public key
   */
  async setServerPublicKey(publicKey: string): Promise<void> {
    try {
      this.serverPublicKey = naclUtil.decodeBase64(publicKey);
      localStorage.setItem(ENCRYPTION_KEYS.SERVER_PUBLIC_KEY, publicKey);
      console.log('🔐 Server public key set');
    } catch (error) {
      console.error('Failed to set server public key:', error);
      throw error;
    }
  }

  /**
   * Generate a random session key for symmetric encryption
   */
  async generateSessionKey(): Promise<string> {
    this.sessionKey = nacl.randomBytes(nacl.secretbox.keyLength);
    const sessionKeyBase64 = naclUtil.encodeBase64(this.sessionKey);
    localStorage.setItem(ENCRYPTION_KEYS.SESSION_KEY, sessionKeyBase64);
    return sessionKeyBase64;
  }

  /**
   * Set session key (received from server during handshake)
   */
  async setSessionKey(sessionKey: string): Promise<void> {
    this.sessionKey = naclUtil.decodeBase64(sessionKey);
    localStorage.setItem(ENCRYPTION_KEYS.SESSION_KEY, sessionKey);
  }

  /**
   * Encrypt data using asymmetric encryption (box)
   * Used for initial key exchange and sensitive one-time data
   */
  encryptAsymmetric(data: string): EncryptedPayload {
    if (!this.keyPair || !this.serverPublicKey) {
      throw new Error('Encryption not properly initialized');
    }

    const messageBytes = naclUtil.decodeUTF8(data);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    const ciphertext = nacl.box(
      messageBytes,
      nonce,
      this.serverPublicKey,
      this.keyPair.secretKey
    );

    if (!ciphertext) {
      throw new Error('Encryption failed');
    }

    return {
      ciphertext: naclUtil.encodeBase64(ciphertext),
      nonce: naclUtil.encodeBase64(nonce),
      publicKey: this.getPublicKey(),
    };
  }

  /**
   * Decrypt data using asymmetric encryption (box)
   */
  decryptAsymmetric(payload: EncryptedPayload): string {
    if (!this.keyPair) {
      throw new Error('Encryption not initialized');
    }

    const ciphertext = naclUtil.decodeBase64(payload.ciphertext);
    const nonce = naclUtil.decodeBase64(payload.nonce);
    const senderPublicKey = naclUtil.decodeBase64(payload.publicKey);

    const decrypted = nacl.box.open(
      ciphertext,
      nonce,
      senderPublicKey,
      this.keyPair.secretKey
    );

    if (!decrypted) {
      throw new Error('Decryption failed - invalid ciphertext or key');
    }

    return naclUtil.encodeUTF8(decrypted);
  }

  /**
   * Encrypt data using symmetric encryption (secretbox)
   * Used for regular message encryption after key exchange
   */
  encryptSymmetric(data: string): { ciphertext: string; nonce: string } {
    if (!this.sessionKey) {
      throw new Error('Session key not set');
    }

    const messageBytes = naclUtil.decodeUTF8(data);
    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);

    const ciphertext = nacl.secretbox(messageBytes, nonce, this.sessionKey);

    if (!ciphertext) {
      throw new Error('Symmetric encryption failed');
    }

    return {
      ciphertext: naclUtil.encodeBase64(ciphertext),
      nonce: naclUtil.encodeBase64(nonce),
    };
  }

  /**
   * Decrypt data using symmetric encryption (secretbox)
   */
  decryptSymmetric(ciphertext: string, nonce: string): string {
    if (!this.sessionKey) {
      throw new Error('Session key not set');
    }

    const ciphertextBytes = naclUtil.decodeBase64(ciphertext);
    const nonceBytes = naclUtil.decodeBase64(nonce);

    const decrypted = nacl.secretbox.open(ciphertextBytes, nonceBytes, this.sessionKey);

    if (!decrypted) {
      throw new Error('Symmetric decryption failed');
    }

    return naclUtil.encodeUTF8(decrypted);
  }

  /**
   * Encrypt an object (converts to JSON first)
   */
  encryptObject<T>(data: T): EncryptedPayload {
    const jsonString = JSON.stringify(data);
    return this.encryptAsymmetric(jsonString);
  }

  /**
   * Decrypt to an object
   */
  decryptObject<T>(payload: EncryptedPayload): T {
    const jsonString = this.decryptAsymmetric(payload);
    return JSON.parse(jsonString);
  }

  /**
   * Encrypt object using symmetric key
   */
  encryptObjectSymmetric<T>(data: T): { ciphertext: string; nonce: string } {
    const jsonString = JSON.stringify(data);
    return this.encryptSymmetric(jsonString);
  }

  /**
   * Decrypt to object using symmetric key
   */
  decryptObjectSymmetric<T>(ciphertext: string, nonce: string): T {
    const jsonString = this.decryptSymmetric(ciphertext, nonce);
    return JSON.parse(jsonString);
  }

  /**
   * Hash a string using SHA-512 (for password hashing, etc.)
   */
  hash(data: string): string {
    const dataBytes = naclUtil.decodeUTF8(data);
    const hashBytes = nacl.hash(dataBytes);
    return naclUtil.encodeBase64(hashBytes);
  }

  /**
   * Generate a random ID
   */
  generateRandomId(length: number = 32): string {
    const bytes = nacl.randomBytes(length);
    return naclUtil.encodeBase64(bytes).replace(/[+/=]/g, '').slice(0, length);
  }

  /**
   * Check if encryption is ready
   */
  isReady(): boolean {
    return this.isInitialized && !!this.keyPair;
  }

  /**
   * Check if server key is set
   */
  hasServerKey(): boolean {
    return !!this.serverPublicKey;
  }

  /**
   * Check if session key is set
   */
  hasSessionKey(): boolean {
    return !!this.sessionKey;
  }

  /**
   * Get initialization error if any
   */
  getInitError(): Error | null {
    return this.initError;
  }

  /**
   * Clear all encryption data (for logout)
   */
  clearAll(): void {
    this.sessionKey = null;
    localStorage.removeItem(ENCRYPTION_KEYS.SESSION_KEY);
    console.log('🔐 Session key cleared');
  }

  /**
   * Reset encryption completely (generates new keys)
   */
  async reset(): Promise<void> {
    localStorage.removeItem(ENCRYPTION_KEYS.KEY_PAIR);
    localStorage.removeItem(ENCRYPTION_KEYS.SERVER_PUBLIC_KEY);
    localStorage.removeItem(ENCRYPTION_KEYS.SESSION_KEY);
    
    this.keyPair = null;
    this.serverPublicKey = null;
    this.sessionKey = null;
    this.isInitialized = false;
    this.initError = null;

    await this.initialize();
    console.log('🔐 Encryption reset complete');
  }

  // Private methods

  private loadKeyPair(): KeyPair | null {
    try {
      const stored = localStorage.getItem(ENCRYPTION_KEYS.KEY_PAIR);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveKeyPair(): void {
    if (!this.keyPair) return;

    const keyPairData: KeyPair = {
      publicKey: naclUtil.encodeBase64(this.keyPair.publicKey),
      secretKey: naclUtil.encodeBase64(this.keyPair.secretKey),
    };

    localStorage.setItem(ENCRYPTION_KEYS.KEY_PAIR, JSON.stringify(keyPairData));
  }

  private loadServerPublicKey(): void {
    try {
      const stored = localStorage.getItem(ENCRYPTION_KEYS.SERVER_PUBLIC_KEY);
      if (stored) {
        this.serverPublicKey = naclUtil.decodeBase64(stored);
      }
    } catch (error) {
      console.log('No server public key stored');
    }
  }
}

export const encryptionService = EncryptionService.getInstance();
export default encryptionService;
