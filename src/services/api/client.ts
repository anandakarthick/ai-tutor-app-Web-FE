/**
 * API Client with E2E Encryption for Web
 * Axios instance with automatic encryption/decryption for all API calls
 * 
 * - Sends X-Client-Public-Key header for ALL requests (enables encrypted responses)
 * - Encrypts POST/PUT/PATCH body data
 * - Decrypts encrypted responses automatically
 */

import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_CONFIG, ENDPOINTS } from './config';
import encryptionService from '../encryption/EncryptionService';

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  STUDENT: 'student',
  ENCRYPTION_ENABLED: 'encryptionEnabled',
};

// Session terminated callback
let onSessionTerminated: (() => void) | null = null;

export const setSessionTerminatedCallback = (callback: () => void) => {
  onSessionTerminated = callback;
};

// Encryption state
let isEncryptionEnabled = false;
let isHandshakeComplete = false;
let handshakeAttempted = false;
let handshakePromise: Promise<boolean> | null = null;

// Endpoints that should NOT be encrypted
const UNENCRYPTED_ENDPOINTS = [
  '/auth/handshake',
  '/auth/public-key',
  '/payments', // Payment routes - skip encryption
  '/subscriptions', // Subscription routes - skip encryption
];

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Get client public key (must be called after encryption is initialized)
 */
const getClientPublicKey = (): string | null => {
  try {
    if (encryptionService.isReady()) {
      return encryptionService.getPublicKey();
    }
    return null;
  } catch (error) {
    console.error('Failed to get client public key:', error);
    return null;
  }
};

/**
 * Initialize encryption and perform handshake with server
 */
export const initializeEncryption = async (): Promise<boolean> => {
  // Return existing promise if handshake is in progress
  if (handshakePromise) {
    return handshakePromise;
  }

  if (handshakeAttempted) {
    return isEncryptionEnabled && isHandshakeComplete;
  }

  handshakePromise = (async () => {
    handshakeAttempted = true;

    if (!API_CONFIG.ENCRYPTION_ENABLED) {
      console.log('🔓 E2E Encryption disabled in config');
      isEncryptionEnabled = false;
      return false;
    }

    try {
      console.log('🔐 Initializing E2E encryption...');
      console.log('📡 Backend URL:', API_CONFIG.BASE_URL);
      
      // Initialize encryption service
      await encryptionService.initialize();
      
      if (!encryptionService.isReady()) {
        console.warn('⚠️ Encryption service failed to initialize');
        isEncryptionEnabled = false;
        return false;
      }

      const clientPublicKey = encryptionService.getPublicKey();
      console.log('🔑 Client public key:', clientPublicKey.substring(0, 20) + '...');
      
      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.HANDSHAKE}`,
        { clientPublicKey },
        { timeout: 10000 }
      );

      if (response.data.success && response.data.data) {
        const serverPublicKey = response.data.data.serverPublicKey;
        const serverEncryptionEnabled = response.data.data.encryptionEnabled !== false;
        
        console.log('🔑 Server public key:', serverPublicKey?.substring(0, 20) + '...');
        console.log('📋 Server encryption enabled:', serverEncryptionEnabled);
        
        if (serverPublicKey && serverEncryptionEnabled) {
          await encryptionService.setServerPublicKey(serverPublicKey);
          isEncryptionEnabled = true;
          isHandshakeComplete = true;
          localStorage.setItem(STORAGE_KEYS.ENCRYPTION_ENABLED, 'true');
          console.log('✅ E2E Encryption enabled successfully');
          return true;
        } else {
          console.log('🔓 Server has encryption disabled');
          isEncryptionEnabled = false;
          return false;
        }
      }
      
      console.log('⚠️ Handshake response invalid');
      return false;
    } catch (error: any) {
      if (error.code === 'ECONNREFUSED') {
        console.warn('⚠️ Backend server not running at', API_CONFIG.BASE_URL);
      } else if (error.code === 'ENOTFOUND' || error.message?.includes('Network Error')) {
        console.warn('⚠️ Cannot reach backend. Check IP address:', API_CONFIG.BASE_URL);
      } else {
        console.warn('⚠️ E2E handshake failed:', error.message || error);
      }
      
      isEncryptionEnabled = false;
      console.log('🔓 Continuing without encryption');
      return false;
    } finally {
      handshakePromise = null;
    }
  })();

  return handshakePromise;
};

/**
 * Check if endpoint should be encrypted
 */
const shouldEncryptEndpoint = (url: string): boolean => {
  if (!isEncryptionEnabled || !isHandshakeComplete) return false;
  if (!encryptionService.isReady() || !encryptionService.hasServerKey()) return false;
  if (UNENCRYPTED_ENDPOINTS.some(endpoint => url.includes(endpoint))) return false;
  return true;
};

/**
 * Encrypt request data
 */
const encryptRequestData = (data: any): any => {
  if (!encryptionService.isReady() || !encryptionService.hasServerKey()) {
    return data;
  }
  
  try {
    const encryptedPayload = encryptionService.encryptObject(data);
    return {
      encrypted: true,
      payload: encryptedPayload,
    };
  } catch (error) {
    console.error('❌ Request encryption failed:', error);
    return data;
  }
};

/**
 * Decrypt response data
 */
const decryptResponseData = (data: any): any => {
  if (!data?.encrypted || !data?.payload) {
    return data;
  }
  
  if (!encryptionService.isReady()) {
    console.warn('Cannot decrypt: encryption not ready');
    return data;
  }
  
  try {
    return encryptionService.decryptObject(data.payload);
  } catch (error) {
    console.error('❌ Response decryption failed:', error);
    return data;
  }
};

// Request interceptor - Add auth token, client public key header, and encrypt body
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add auth token
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const url = config.url || '';
    const shouldEncrypt = shouldEncryptEndpoint(url);
    
    // ALWAYS send client public key header when encryption is enabled
    // This tells the server to encrypt the response (for GET and other requests)
    if (shouldEncrypt && config.headers) {
      const clientPublicKey = getClientPublicKey();
      if (clientPublicKey) {
        config.headers['X-Client-Public-Key'] = clientPublicKey;
        console.log('📤 Adding X-Client-Public-Key header for:', url);
      } else {
        console.warn('⚠️ Could not get client public key');
      }
    }
    
    // Encrypt request body for POST/PUT/PATCH
    if (config.data && shouldEncrypt && config.method !== 'get') {
      console.log(`🔐 Encrypting request: ${config.method?.toUpperCase()} ${url}`);
      console.log('📦 Original data:', JSON.stringify(config.data, null, 2));
      
      const encryptedData = encryptRequestData(config.data);
      
      console.log('🔐 Encrypted payload:', {
        encrypted: encryptedData.encrypted,
        ciphertext: encryptedData.payload?.ciphertext?.substring(0, 50) + '...',
        nonce: encryptedData.payload?.nonce,
        publicKey: encryptedData.payload?.publicKey?.substring(0, 20) + '...',
      });
      
      config.data = encryptedData;
    }
    
    if (import.meta.env.DEV) {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${url} [encrypted: ${shouldEncrypt}]`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Decrypt and handle errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url || '';
    
    // Log raw response for debugging
    if (import.meta.env.DEV) {
      console.log(`✅ Response: ${url} - ${response.status}`);
      console.log('📦 Raw response data:', JSON.stringify(response.data, null, 2));
    }
    
    // Decrypt response if encrypted
    if (response.data?.encrypted) {
      console.log(`🔓 Decrypting response from: ${url}`);
      console.log('🔐 Encrypted payload:', {
        ciphertext: response.data.payload?.ciphertext?.substring(0, 50) + '...',
        nonce: response.data.payload?.nonce,
        publicKey: response.data.payload?.publicKey?.substring(0, 20) + '...',
      });
      
      const decrypted = decryptResponseData(response.data);
      console.log('✅ Decrypted data:', JSON.stringify(decrypted, null, 2));
      response.data = decrypted;
    }
    
    return response;
  },
  async (error: AxiosError<{code?: string; message?: string; encrypted?: boolean; payload?: any}>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {_retry?: boolean};

    if (import.meta.env.DEV) {
      console.log(`❌ Error: ${originalRequest?.url} - ${error.response?.status}`);
    }

    // Decrypt error response if encrypted
    if (error.response?.data?.encrypted) {
      error.response.data = decryptResponseData(error.response.data);
    }

    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      const skipRefreshCodes = ['SESSION_TERMINATED', 'INVALID_TOKEN', 'NO_TOKEN'];
      if (skipRefreshCodes.includes(error.response?.data?.code || '')) {
        clearAuthTokens();
        
        // If session terminated, call the callback instead of redirecting
        if (error.response?.data?.code === 'SESSION_TERMINATED' && onSessionTerminated) {
          console.log('🚫 Session terminated - calling callback');
          onSessionTerminated();
        } else {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(
          `${API_CONFIG.BASE_URL}${ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {refreshToken}
        );

        let responseData = response.data;
        if (responseData.encrypted) {
          responseData = decryptResponseData(responseData);
        }

        const {accessToken, refreshToken: newRefreshToken} = responseData.data;
        
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        clearAuthTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.STUDENT);
  encryptionService.clearAll();
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const isEncryptionReady = (): boolean => {
  return isEncryptionEnabled && isHandshakeComplete && encryptionService.isReady();
};

export const getEncryptionStatus = () => ({
  enabled: isEncryptionEnabled,
  handshakeComplete: isHandshakeComplete,
  serviceReady: encryptionService.isReady(),
  hasServerKey: encryptionService.hasServerKey(),
  configEnabled: API_CONFIG.ENCRYPTION_ENABLED,
});

export const getStoredUser = () => {
  const userStr = localStorage.getItem(STORAGE_KEYS.USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const getStoredStudent = () => {
  const studentStr = localStorage.getItem(STORAGE_KEYS.STUDENT);
  return studentStr ? JSON.parse(studentStr) : null;
};

export const setStoredUser = (user: any) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const setStoredStudent = (student: any) => {
  localStorage.setItem(STORAGE_KEYS.STUDENT, JSON.stringify(student));
};

export default apiClient;
