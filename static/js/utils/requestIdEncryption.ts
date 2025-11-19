/**
 * Simple client for generating encrypted request IDs
 */

// Simple XOR encryption function for JavaScript
function xorEncrypt(text: string, key: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// Base64 encoding for JavaScript
function base64Encode(str: string): string {
    // Use a more robust base64 encoding that handles UTF-8 properly
    return btoa(unescape(encodeURIComponent(str)));
}

function base64Decode(str: string): string {
    // Use a more robust base64 decoding that handles UTF-8 properly
    return decodeURIComponent(escape(atob(str)));
}

function generateRequestId(): string {
    // Generate a UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function encryptRequestId(requestId: string, secretKey: string): string {
    /**
     * Encrypt a request ID using a secret key
     * 
     * @param {string} requestId - UUID string to encrypt
     * @param {string} secretKey - Secret key for encryption
     * @returns {string} Base64 encoded encrypted request ID
     */
    try {
        // Validate UUID format (basic check)
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) {
            throw new Error('Invalid UUID format');
        }
        
        // Encrypt using XOR
        const encrypted = xorEncrypt(requestId, secretKey);
        
        // Encode as base64
        return base64Encode(encrypted);
        
    } catch (error) {
        throw new Error(`Failed to encrypt request ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function decryptRequestId(encryptedRequestId: string, secretKey: string): string {
    /**
     * Decrypt a request ID using a secret key
     * 
     * @param {string} encryptedRequestId - Base64 encoded encrypted request ID
     * @param {string} secretKey - Secret key for decryption
     * @returns {string} Decrypted UUID string
     */
    try {
        // Decode base64
        const decoded = base64Decode(encryptedRequestId);
        
        // Decrypt using XOR (symmetric)
        const decrypted = xorEncrypt(decoded, secretKey);
        
        // Validate UUID format
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decrypted)) {
            throw new Error('Invalid UUID format after decryption');
        }
        
        return decrypted;
        
    } catch (error) {
        throw new Error(`Failed to decrypt request ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function generateAndEncryptRequestId(secretKey: string): {
    original: string;
    encrypted: string;
} {
    /**
     * Generate a new UUID and encrypt it
     * 
     * @param {string} secretKey - Secret key for encryption
     * @returns {Object} Object with original and encrypted UUIDs
     */
    const originalId = generateRequestId();
    const encryptedId = encryptRequestId(originalId, secretKey);
    
    return {
        original: originalId,
        encrypted: encryptedId
    };
}

// Default secret key - in production, this should be stored securely
const DEFAULT_SECRET_KEY = '04026aadf583caa59cbbf8599d15889274c2fff741b3a8a19229861aa25c6290';

/**
 * Generate an encrypted request ID for API headers
 * @returns {string} Encrypted request ID ready for X-Request-ID header
 */
export function generateEncryptedRequestId(): string {
    const { encrypted } = generateAndEncryptRequestId(DEFAULT_SECRET_KEY);
    return encrypted;
}

/**
 * Decrypt a request ID (for debugging/verification purposes)
 * @param {string} encryptedRequestId - The encrypted request ID
 * @returns {string} The original UUID
 */
export function decryptRequestIdForDebug(encryptedRequestId: string): string {
    return decryptRequestId(encryptedRequestId, DEFAULT_SECRET_KEY);
}

// Export all functions for potential use elsewhere
export {
    generateRequestId,
    encryptRequestId,
    decryptRequestId,
    generateAndEncryptRequestId
}; 