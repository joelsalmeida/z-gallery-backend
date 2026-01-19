import { UserId } from './user-id.vo';

describe('UserId', () => {
  describe('generate', () => {
    it('should generate a UserId instance', () => {
      const userId = UserId.generate();

      expect(userId).toBeInstanceOf(UserId);
    });

    it('should generate a value in the expected format', () => {
      const userId = UserId.generate();
      const value = userId.toValue();

      // Format: XXXX-XXXX-XXXX-XXXX (uppercase hex)
      const USER_ID_REGEX = /^[A-F0-9]{4}(?:-[A-F0-9]{4}){3}$/;

      expect(value).toMatch(USER_ID_REGEX);
    });

    /**
     * This test generates multiple UserId values and collects their string
     * representations into a Set. Since a Set only stores unique values,
     * any duplicate identifiers would be automatically discarded.
     *
     * By asserting that the Set size matches the number of generated values,
     * the test verifies that each call to UserId.generate() produced a
     * different identifier.
     */
    it('should generate unique values across multiple calls', () => {
      const ids = new Set(
        Array.from({ length: 10 }, () => UserId.generate().toValue()),
      );

      expect(ids.size).toBe(10);
    });
  });

  describe('restore', () => {
    it('should restore a UserId from a persisted value', () => {
      const persistedId = '9F3A-7C2D-B81E-9A57';

      const userId = UserId.restore(persistedId);

      expect(userId.toValue()).toBe(persistedId);
    });

    it('should bypass validation when restoring', () => {
      const invalidButPersistedId = 'not-a-valid-user-id';

      const userId = UserId.restore(invalidButPersistedId);

      expect(userId.toValue()).toBe(invalidButPersistedId);
    });
  });

  describe('toValue', () => {
    it('should return the underlying identifier value', () => {
      const value = 'ABCD-EF12-3456-7890';
      const userId = UserId.restore(value);

      expect(userId.toValue()).toBe(value);
    });
  });

  describe('equals', () => {
    it('should return true for UserIds with the same value', () => {
      const value = 'ABCD-EF12-3456-7890';

      const userId1 = UserId.restore(value);
      const userId2 = UserId.restore(value);

      expect(userId1.equals(userId2)).toBe(true);
    });

    it('should return false for UserIds with different values', () => {
      const userId1 = UserId.restore('AAAA-BBBB-CCCC-DDDD');
      const userId2 = UserId.restore('EEEE-FFFF-1111-2222');

      expect(userId1.equals(userId2)).toBe(false);
    });

    it('should return true when comparing the same instance', () => {
      const userId = UserId.generate();

      expect(userId.equals(userId)).toBe(true);
    });
  });
});
