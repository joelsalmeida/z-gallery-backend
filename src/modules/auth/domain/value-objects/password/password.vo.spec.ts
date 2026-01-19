import { InvalidPasswordException } from './exceptions';
import { Password } from './password.vo';

describe('Password', () => {
  describe('fromString', () => {
    it('should create a Password instance for a valid password', () => {
      const validPassword = 'Abcdef1234$!';
      const password = Password.fromString(validPassword);

      expect(password).toBeInstanceOf(Password);
      expect(password.exposeValue()).toBe(validPassword);
    });

    it('should throw InvalidPasswordException for password shorter than 12 chars', () => {
      const shortPassword = 'Ab1$def';
      expect(() => Password.fromString(shortPassword)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException if missing lowercase', () => {
      const noLower = 'ABCDEFGH123$!';
      expect(() => Password.fromString(noLower)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException if missing uppercase', () => {
      const noUpper = 'abcdefg123$!';
      expect(() => Password.fromString(noUpper)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException if missing number', () => {
      const noNumber = 'Abcdefghijk$!';
      expect(() => Password.fromString(noNumber)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException if missing special character', () => {
      const noSpecial = 'Abcdefgh1234';
      expect(() => Password.fromString(noSpecial)).toThrow(
        InvalidPasswordException,
      );
    });

    it('should throw InvalidPasswordException for non-string values', () => {
      expect(() => Password.fromString(null as unknown as string)).toThrow(
        InvalidPasswordException,
      );
      expect(() => Password.fromString(undefined as unknown as string)).toThrow(
        InvalidPasswordException,
      );
      expect(() => Password.fromString(12345 as unknown as string)).toThrow(
        InvalidPasswordException,
      );
    });
  });

  describe('exposeValue', () => {
    it('should return the original password string', () => {
      const raw = 'Abcdef1234$!';
      const password = Password.fromString(raw);

      expect(password.exposeValue()).toBe(raw);
    });
  });
});
