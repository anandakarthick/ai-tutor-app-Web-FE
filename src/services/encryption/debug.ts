/**
 * Debug Utility for E2E Encryption
 * Exposes encryption functions to window for debugging in browser console
 */

import encryptionService from './EncryptionService';

interface EncryptedPayload {
  ciphertext: string;
  nonce: string;
  publicKey: string;
}

interface EncryptedResponse {
  encrypted: boolean;
  payload: EncryptedPayload;
}

/**
 * Debug functions exposed to window object
 */
const encryptionDebug = {
  /**
   * Get encryption status
   */
  status: () => {
    return {
      isReady: encryptionService.isReady(),
      hasServerKey: encryptionService.hasServerKey(),
      clientPublicKey: encryptionService.isReady() ? encryptionService.getPublicKey() : null,
    };
  },

  /**
   * Decrypt an encrypted response
   * Usage in console: encryptionDebug.decrypt({ encrypted: true, payload: {...} })
   */
  decrypt: (encryptedData: EncryptedResponse) => {
    if (!encryptedData?.encrypted || !encryptedData?.payload) {
      console.error('❌ Invalid encrypted data format. Expected: { encrypted: true, payload: { ciphertext, nonce, publicKey } }');
      return null;
    }

    if (!encryptionService.isReady()) {
      console.error('❌ Encryption service not ready');
      return null;
    }

    try {
      const decrypted = encryptionService.decryptObject(encryptedData.payload);
      console.log('✅ Decrypted successfully:');
      console.log(JSON.stringify(decrypted, null, 2));
      return decrypted;
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      return null;
    }
  },

  /**
   * Decrypt just the payload (without the wrapper)
   * Usage in console: encryptionDebug.decryptPayload({ ciphertext: "...", nonce: "...", publicKey: "..." })
   */
  decryptPayload: (payload: EncryptedPayload) => {
    if (!payload?.ciphertext || !payload?.nonce || !payload?.publicKey) {
      console.error('❌ Invalid payload format. Expected: { ciphertext, nonce, publicKey }');
      return null;
    }

    if (!encryptionService.isReady()) {
      console.error('❌ Encryption service not ready');
      return null;
    }

    try {
      const decrypted = encryptionService.decryptObject(payload);
      console.log('✅ Decrypted successfully:');
      console.log(JSON.stringify(decrypted, null, 2));
      return decrypted;
    } catch (error) {
      console.error('❌ Decryption failed:', error);
      return null;
    }
  },

  /**
   * Encrypt data (for testing)
   * Usage in console: encryptionDebug.encrypt({ test: "data" })
   */
  encrypt: (data: any) => {
    if (!encryptionService.isReady() || !encryptionService.hasServerKey()) {
      console.error('❌ Encryption not ready or no server key');
      return null;
    }

    try {
      const encrypted = encryptionService.encryptObject(data);
      console.log('✅ Encrypted successfully:');
      console.log(JSON.stringify({ encrypted: true, payload: encrypted }, null, 2));
      return { encrypted: true, payload: encrypted };
    } catch (error) {
      console.error('❌ Encryption failed:', error);
      return null;
    }
  },

  /**
   * Decrypt from Network tab copied JSON string
   * Usage: Copy response from Network tab, then: encryptionDebug.decryptFromJson('{"encrypted":true,"payload":{...}}')
   */
  decryptFromJson: (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      return encryptionDebug.decrypt(data);
    } catch (error) {
      console.error('❌ Invalid JSON:', error);
      return null;
    }
  },

  /**
   * Get the raw encryption service (for advanced debugging)
   */
  getService: () => encryptionService,

  /**
   * Help - show available commands
   */
  help: () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║              E2E Encryption Debug Utilities                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  encryptionDebug.status()                                       ║
║    → Check encryption status                                    ║
║                                                                 ║
║  encryptionDebug.decrypt(response)                              ║
║    → Decrypt a full encrypted response                          ║
║    → Example: encryptionDebug.decrypt({                         ║
║        encrypted: true,                                         ║
║        payload: { ciphertext: "...", nonce: "...", publicKey: "..." }║
║      })                                                         ║
║                                                                 ║
║  encryptionDebug.decryptPayload(payload)                        ║
║    → Decrypt just the payload object                            ║
║    → Example: encryptionDebug.decryptPayload({                  ║
║        ciphertext: "...", nonce: "...", publicKey: "..."        ║
║      })                                                         ║
║                                                                 ║
║  encryptionDebug.decryptFromJson(jsonString)                    ║
║    → Decrypt from copied JSON string                            ║
║    → Example: encryptionDebug.decryptFromJson('{"encrypted":...}')║
║                                                                 ║
║  encryptionDebug.encrypt(data)                                  ║
║    → Encrypt any data                                           ║
║    → Example: encryptionDebug.encrypt({ test: "hello" })        ║
║                                                                 ║
║  encryptionDebug.getService()                                   ║
║    → Get raw encryption service                                 ║
║                                                                 ║
╚════════════════════════════════════════════════════════════════╝
    `);
  },
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).encryptionDebug = encryptionDebug;
  console.log('🔐 Encryption debug utilities loaded. Type encryptionDebug.help() for available commands.');
}

export default encryptionDebug;
