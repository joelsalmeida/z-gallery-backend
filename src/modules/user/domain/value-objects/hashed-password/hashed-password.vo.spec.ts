import { InvalidHashedPasswordException } from './exceptions';
import { HashedPassword } from './hashed-password.vo';

describe('HashedPassword', () => {
  describe('fromHash', () => {
    it('should create a HashedPassword instance with a valid hash', () => {
      const validHash = 'a'.repeat(32);
      const hashedPassword = HashedPassword.fromHash(validHash);

      expect(hashedPassword.toValue()).toBe(validHash);
    });

    it('should create a HashedPassword with base64 format', () => {
      const base64Hash = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=';
      const hashedPassword = HashedPassword.fromHash(base64Hash);

      expect(hashedPassword.toValue()).toBe(base64Hash);
    });

    it('should create a HashedPassword with hex format', () => {
      const hexHash = 'a'.repeat(32);
      const hashedPassword = HashedPassword.fromHash(hexHash);

      expect(hashedPassword.toValue()).toBe(hexHash);
    });

    it('should create a HashedPassword with PHC-style hash', () => {
      const phcHash = '$2b$12$' + 'a'.repeat(53);
      const hashedPassword = HashedPassword.fromHash(phcHash);

      expect(hashedPassword.toValue()).toBe(phcHash);
    });
  });

  describe('fromHash validation failures', () => {
    it('should throw for non-string values', () => {
      expect(() => HashedPassword.fromHash(null as unknown as string)).toThrow(
        InvalidHashedPasswordException,
      );
    });

    it('should throw for hashes shorter than minimum length', () => {
      expect(() => HashedPassword.fromHash('short')).toThrow(
        InvalidHashedPasswordException,
      );
    });

    it('should throw for hashes longer than maximum length', () => {
      expect(() => HashedPassword.fromHash('a'.repeat(256))).toThrow(
        InvalidHashedPasswordException,
      );
    });

    it('should throw for hashes with invalid characters', () => {
      expect(() => HashedPassword.fromHash('a'.repeat(31) + ' ')).toThrow(
        InvalidHashedPasswordException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a HashedPassword without validation', () => {
      const hash = 'a'.repeat(32);
      const hashedPassword = HashedPassword.restore(hash);

      expect(hashedPassword.toValue()).toBe(hash);
    });

    it('should bypass validation when restoring', () => {
      const invalidHash = 'short';
      const hashedPassword = HashedPassword.restore(invalidHash);

      expect(hashedPassword.toValue()).toBe(invalidHash);
    });
  });

  describe('toValue', () => {
    it('should return the hash value', () => {
      const hash = 'a'.repeat(32);
      const hashedPassword = HashedPassword.fromHash(hash);

      expect(hashedPassword.toValue()).toBe(hash);
    });
  });

  describe('equals', () => {
    it('should return true when comparing equal HashedPassword instances', () => {
      const hash = 'a'.repeat(32);
      const hashedPassword1 = HashedPassword.fromHash(hash);
      const hashedPassword2 = HashedPassword.fromHash(hash);

      expect(hashedPassword1.equals(hashedPassword2)).toBe(true);
    });

    it('should return false when comparing different HashedPassword instances', () => {
      const hashedPassword1 = HashedPassword.fromHash('a'.repeat(32));
      const hashedPassword2 = HashedPassword.fromHash('b'.repeat(32));

      expect(hashedPassword1.equals(hashedPassword2)).toBe(false);
    });

    it('should return true when comparing the same instance', () => {
      const hashedPassword = HashedPassword.fromHash('a'.repeat(32));
      expect(hashedPassword.equals(hashedPassword)).toBe(true);
    });
  });
});
