# End-to-End Encryption (E2E) for Web Frontend

## Overview

This web application implements End-to-End Encryption (E2E) to secure all API communications between the web browser and the backend server. The encryption uses TweetNaCl (NaCl - Networking and Cryptography library) which provides high-security, high-speed cryptographic operations.

## How It Works

### 1. Key Exchange (Handshake)

When the application starts, it performs a handshake with the server:

1. **Client generates key pair**: Using `nacl.box.keyPair()`, the client generates a public/secret key pair
2. **Client sends public key**: The client sends its public key to `/auth/handshake`
3. **Server responds with its public key**: The server sends back its public key
4. **Keys are stored**: Both keys are stored in localStorage for future use

### 2. Request Encryption

For POST/PUT/PATCH requests:

1. Request body is converted to JSON string
2. JSON is encrypted using `nacl.box()` with:
   - Client's secret key
   - Server's public key
   - Random nonce
3. Encrypted payload is sent with structure:
   ```json
   {
     "encrypted": true,
     "payload": {
       "ciphertext": "base64...",
       "nonce": "base64...",
       "publicKey": "client's public key"
     }
   }
   ```

### 3. Response Encryption

For all requests where client sends `X-Client-Public-Key` header:

1. Server encrypts the response using client's public key
2. Response is received with structure:
   ```json
   {
     "encrypted": true,
     "payload": {
       "ciphertext": "base64...",
       "nonce": "base64...",
       "publicKey": "server's public key"
     }
   }
   ```
3. Client decrypts using `nacl.box.open()` with:
   - Client's secret key
   - Server's public key
   - Nonce from payload

## Implementation Files

### 1. EncryptionService (`src/services/encryption/EncryptionService.ts`)

Provides core encryption functionality:
- `initialize()` - Initializes the encryption service
- `getPublicKey()` - Returns client's public key
- `setServerPublicKey()` - Sets server's public key
- `encryptObject()` - Encrypts an object
- `decryptObject()` - Decrypts an object
- `encryptAsymmetric()` - Low-level encryption
- `decryptAsymmetric()` - Low-level decryption

### 2. API Client (`src/services/api/client.ts`)

Automatically handles:
- Encryption initialization via `initializeEncryption()`
- Adding `X-Client-Public-Key` header to encrypted requests
- Encrypting request bodies for POST/PUT/PATCH
- Decrypting encrypted responses
- Token refresh with encryption support

### 3. API Config (`src/services/api/config.ts`)

Configuration:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://192.168.1.3:3000/api/v1',
  TIMEOUT: 30000,
  ENCRYPTION_ENABLED: true, // Toggle encryption
};
```

## Usage

### Automatic Encryption

Once initialized, all API requests are automatically encrypted. No special handling needed:

```typescript
// This is automatically encrypted
const response = await apiClient.post('/learning/session', {
  studentId: '123',
  topicId: '456',
});

// Response is automatically decrypted
console.log(response.data);
```

### Check Encryption Status

```typescript
import { isEncryptionReady, getEncryptionStatus } from './services/api';

if (isEncryptionReady()) {
  console.log('Encryption is active');
}

console.log(getEncryptionStatus());
// {
//   enabled: true,
//   handshakeComplete: true,
//   serviceReady: true,
//   hasServerKey: true,
//   configEnabled: true
// }
```

## Security Considerations

1. **Key Storage**: Keys are stored in localStorage. Consider using IndexedDB with encryption for more security.
2. **HTTPS**: Always use HTTPS in production to prevent MITM attacks during handshake.
3. **Key Rotation**: Consider implementing key rotation for long-lived sessions.
4. **Browser Support**: Uses Web Crypto API when available, falls back to Math.random (less secure).

## Troubleshooting

### Handshake Failed

- Check if backend is running
- Verify API URL is correct
- Check CORS settings on backend
- Look for errors in browser console

### Decryption Failed

- Keys might be out of sync - try clearing localStorage and refreshing
- Server might have restarted - perform new handshake
- Check if correct public key is being used

## Dependencies

- `tweetnacl`: ^1.0.3 - Core cryptographic library
- `tweetnacl-util`: ^0.15.1 - Utility functions for encoding/decoding

## Backend Requirements

The backend must implement:
- `POST /auth/handshake` - Accept client public key, return server public key
- `GET /auth/public-key` - Return server public key
- Request decryption middleware
- Response encryption when `X-Client-Public-Key` header is present

See backend `src/middlewares/encryption.ts` for implementation details.
