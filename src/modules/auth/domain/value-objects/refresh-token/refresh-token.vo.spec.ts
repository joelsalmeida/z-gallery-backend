import { UserId } from '../../../../user/domain/value-objects';
import { InvalidRefreshTokenException } from './exceptions';
import { RefreshToken } from './refresh-token.vo';

describe('RefreshToken', () => {
  let userId: UserId;
  let futureDate: Date;

  beforeEach(() => {
    userId = UserId.generate();
    const ONE_HOUR = 1000 * 60 * 60;
    futureDate = new Date(Date.now() + ONE_HOUR);
  });

  describe('create', () => {
    it('should create a RefreshToken with valid data', () => {
      const token = RefreshToken.create('token123', userId, futureDate);

      expect(token).toBeInstanceOf(RefreshToken);
      expect(token.value).toBe('token123');
      expect(token.userId).toBe(userId);
      expect(token.expiresAt.getTime()).toBe(futureDate.getTime());
    });

    it('should throw InvalidRefreshTokenException if userId is invalid', () => {
      expect(() =>
        RefreshToken.create('token', null as unknown as UserId, futureDate),
      ).toThrow(InvalidRefreshTokenException);
    });

    it('should throw InvalidRefreshTokenException if expiresAt is not a Date', () => {
      expect(() =>
        RefreshToken.create('token', userId, 'not-a-date' as unknown as Date),
      ).toThrow(InvalidRefreshTokenException);
    });

    it('should throw InvalidRefreshTokenException if expiresAt is in the past', () => {
      const pastDate = new Date(Date.now() - 1000);
      expect(() => RefreshToken.create('token', userId, pastDate)).toThrow(
        InvalidRefreshTokenException,
      );
    });
  });

  describe('restore', () => {
    it('should restore a RefreshToken without validation', () => {
      const pastDate = new Date(Date.now() - 1000);
      const token = RefreshToken.restore('token123', userId, pastDate);

      expect(token.value).toBe('token123');
      expect(token.userId).toBe(userId);
      expect(token.expiresAt.getTime()).toBe(pastDate.getTime());
    });
  });

  describe('isExpired', () => {
    it('should return false if token is not expired', () => {
      const token = RefreshToken.create('token123', userId, futureDate);

      expect(token.isExpired()).toBe(false);
    });

    it('should return true if token is expired', () => {
      const pastDate = new Date(Date.now() - 1000);
      const token = RefreshToken.restore('token123', userId, pastDate);

      expect(token.isExpired()).toBe(true);
    });

    it('should allow passing a custom "now" date for testing', () => {
      const token = RefreshToken.create('token123', userId, futureDate);
      const now = new Date(futureDate.getTime() + 1000); // after expiration

      expect(token.isExpired(now)).toBe(true);
    });
  });

  describe('equals', () => {
    it('should return true for tokens with the same value and userId', () => {
      const token1 = RefreshToken.create('abc', userId, futureDate);
      const token2 = RefreshToken.create('abc', userId, futureDate);

      expect(token1.equals(token2)).toBe(true);
    });

    it('should return false for tokens with different values', () => {
      const token1 = RefreshToken.create('abc', userId, futureDate);
      const token2 = RefreshToken.create('def', userId, futureDate);

      expect(token1.equals(token2)).toBe(false);
    });

    it('should return false for tokens with different userIds', () => {
      const token1 = RefreshToken.create('abc', userId, futureDate);
      const token2 = RefreshToken.create('abc', UserId.generate(), futureDate);

      expect(token1.equals(token2)).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return a clone of expiresAt to prevent mutation', () => {
      const token = RefreshToken.create('token123', userId, futureDate);
      const expiresAt = token.expiresAt;

      expiresAt.setFullYear(2000); // mutate the returned date

      expect(token.expiresAt.getFullYear()).not.toBe(2000); // original stays intact
    });
  });
});
