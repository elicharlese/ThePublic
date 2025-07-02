import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import { logger } from '@/utils/logger';

/**
 * Verify a Solana wallet signature
 * @param walletAddress - The wallet's public key as a string
 * @param signature - The signature bytes as a hex string or base64
 * @param message - The original message that was signed
 * @returns Promise<boolean> - Whether the signature is valid
 */
export async function verifySignature(
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> {
  try {
    // Convert wallet address to PublicKey
    const publicKey = new PublicKey(walletAddress);
    
    // Convert message to bytes
    const messageBytes = new TextEncoder().encode(message);
    
    // Convert signature from hex or base64 to bytes
    let signatureBytes: Uint8Array;
    
    try {
      // Try hex first
      if (signature.startsWith('0x')) {
        signatureBytes = new Uint8Array(
          signature.slice(2).match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
        );
      } else {
        // Try base64
        signatureBytes = new Uint8Array(
          Buffer.from(signature, 'base64')
        );
      }
    } catch (error) {
      logger.error('Failed to parse signature', { error, signature });
      return false;
    }
    
    // Verify signature using nacl (same library used by Solana)
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKey.toBytes()
    );
    
    logger.info('Signature verification result', { 
      walletAddress, 
      isValid,
      messageLength: messageBytes.length,
      signatureLength: signatureBytes.length
    });
    
    return isValid;
  } catch (error) {
    logger.error('Error verifying Solana signature', { 
      error: (error as Error).message, 
      walletAddress,
      message: message.substring(0, 100) + '...' // Log first 100 chars only
    });
    return false;
  }
}

/**
 * Generate a message for wallet authentication
 * @param domain - The domain requesting authentication
 * @param nonce - A random nonce to prevent replay attacks
 * @returns string - The message to be signed
 */
export function generateAuthMessage(domain: string, nonce: string): string {
  const timestamp = new Date().toISOString();
  
  return [
    `Welcome to ${domain}!`,
    '',
    'Please sign this message to authenticate your wallet.',
    '',
    `Domain: ${domain}`,
    `Timestamp: ${timestamp}`,
    `Nonce: ${nonce}`,
    '',
    'This request will not trigger a blockchain transaction or cost any gas fees.',
  ].join('\n');
}

/**
 * Generate a random nonce for authentication
 * @returns string - A random nonce
 */
export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Validate that a message contains required components
 * @param message - The message to validate
 * @param domain - Expected domain
 * @param maxAge - Maximum age in milliseconds (default: 5 minutes)
 * @returns boolean - Whether the message is valid
 */
export function validateAuthMessage(
  message: string,
  domain: string,
  maxAge: number = 5 * 60 * 1000
): boolean {
  try {
    const lines = message.split('\n');
    
    // Check domain
    const domainLine = lines.find(line => line.startsWith('Domain: '));
    if (!domainLine || !domainLine.includes(domain)) {
      return false;
    }
    
    // Check timestamp
    const timestampLine = lines.find(line => line.startsWith('Timestamp: '));
    if (!timestampLine) {
      return false;
    }
    
    const timestamp = new Date(timestampLine.replace('Timestamp: ', ''));
    const now = new Date();
    const age = now.getTime() - timestamp.getTime();
    
    if (age > maxAge) {
      logger.warn('Message too old', { age, maxAge });
      return false;
    }
    
    // Check nonce exists
    const nonceLine = lines.find(line => line.startsWith('Nonce: '));
    if (!nonceLine) {
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error validating auth message', { error });
    return false;
  }
}

/**
 * Extract nonce from authentication message
 * @param message - The authentication message
 * @returns string | null - The nonce if found
 */
export function extractNonce(message: string): string | null {
  try {
    const lines = message.split('\n');
    const nonceLine = lines.find(line => line.startsWith('Nonce: '));
    
    if (!nonceLine) {
      return null;
    }
    
    return nonceLine.replace('Nonce: ', '').trim();
  } catch (error) {
    logger.error('Error extracting nonce', { error });
    return null;
  }
}
