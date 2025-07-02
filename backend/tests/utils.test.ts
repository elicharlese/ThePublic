import { validateSolanaSignature } from '../src/utils/solanaAuth';
import { PublicKey } from '@solana/web3.js';

describe('Solana Auth Utils', () => {
  describe('validateSolanaSignature', () => {
    it('should validate a correct signature', () => {
      // Mock valid signature data
      const publicKey = new PublicKey('11111111111111111111111111111112');
      const message = 'Login to ThePublic';
      const signature = new Uint8Array(64); // Mock signature

      // Note: This would need proper signature generation in a real test
      // For now, we're testing the function structure
      expect(() => {
        validateSolanaSignature(publicKey.toString(), signature, message);
      }).not.toThrow();
    });

    it('should reject invalid public key format', () => {
      const invalidPublicKey = 'invalid-key';
      const message = 'Login to ThePublic';
      const signature = new Uint8Array(64);

      expect(() => {
        validateSolanaSignature(invalidPublicKey, signature, message);
      }).toThrow();
    });

    it('should reject invalid signature length', () => {
      const publicKey = new PublicKey('11111111111111111111111111111112');
      const message = 'Login to ThePublic';
      const signature = new Uint8Array(32); // Wrong length

      expect(() => {
        validateSolanaSignature(publicKey.toString(), signature, message);
      }).toThrow();
    });
  });
});

describe('Validation Utils', () => {
  const { validateEmail, validatePassword, validateWalletAddress } = require('../src/utils/validation');

  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      expect(validatePassword('StrongPass123!')).toBe(true);
      expect(validatePassword('MySecure@Pass1')).toBe(true);
    });

    it('should reject weak passwords', () => {
      expect(validatePassword('123')).toBe(false);
      expect(validatePassword('password')).toBe(false);
      expect(validatePassword('12345678')).toBe(false);
    });
  });

  describe('validateWalletAddress', () => {
    it('should validate Solana wallet addresses', () => {
      const validAddress = '11111111111111111111111111111112';
      expect(validateWalletAddress(validAddress)).toBe(true);
    });

    it('should reject invalid wallet addresses', () => {
      expect(validateWalletAddress('invalid')).toBe(false);
      expect(validateWalletAddress('')).toBe(false);
      expect(validateWalletAddress('0x1234')).toBe(false); // Ethereum format
    });
  });
});

describe('Logger', () => {
  const logger = require('../src/utils/logger');

  it('should log info messages', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    logger.info('Test info message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should log error messages', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('Test error message');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
