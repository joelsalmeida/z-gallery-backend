import { Email } from './email.vo';
import { InvalidEmailException } from './exceptions';

describe('Email', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.toValue()).toBe('user@example.com');
    });

    it('should normalize email to lowercase', () => {
      const email = Email.create('User@Example.COM');
      expect(email.toValue()).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = Email.create('  user@example.com  ');
      expect(email.toValue()).toBe('user@example.com');
    });

    it('should throw InvalidEmailException for missing @', () => {
      expect(() => Email.create('userexample.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should throw InvalidEmailException for missing domain dot', () => {
      expect(() => Email.create('user@example')).toThrow(InvalidEmailException);
    });

    it('should throw InvalidEmailException for whitespace in email', () => {
      expect(() => Email.create('user @example.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should throw InvalidEmailException for multiple @ symbols', () => {
      expect(() => Email.create('user@@example.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should throw InvalidEmailException for empty string', () => {
      expect(() => Email.create('')).toThrow(InvalidEmailException);
    });

    it('should accept valid email variations', () => {
      const validEmails = [
        'test@domain.co',
        'user.name@example.com',
        'user+tag@example.org',
      ];

      validEmails.forEach((validEmail) => {
        const email = Email.create(validEmail);
        expect(email.toValue()).toBeDefined();
      });
    });
  });

  describe('equals', () => {
    it('should return true for emails with the same value', () => {
      const email1 = Email.create('User@Example.COM');
      const email2 = Email.create('user@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for emails with different values', () => {
      const email1 = Email.create('user@example.com');
      const email2 = Email.create('other@example.com');

      expect(email1.equals(email2)).toBe(false);
    });

    it('should return true when comparing the same instance', () => {
      const email = Email.create('user@example.com');

      expect(email.equals(email)).toBe(true);
    });
  });

  describe('restore', () => {
    it('should restore email without validation', () => {
      const email = Email.restore('user@example.com');
      expect(email.toValue()).toBe('user@example.com');
    });
  });

  describe('toValue', () => {
    it('should return the normalized email value', () => {
      const email = Email.create('User@Example.COM');
      expect(email.toValue()).toBe('user@example.com');
    });
  });
});
