import { User } from './user';
import { Email, HashedPassword, UserId } from './value-objects';

describe('User', () => {
  let email: Email;
  let password: HashedPassword;

  beforeEach(() => {
    email = Email.create('user@example.com');
    password = HashedPassword.fromHash('a'.repeat(32));
  });

  describe('create', () => {
    it('should create a new User with a generated UserId', () => {
      const user = User.create(email, password);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBeInstanceOf(UserId);
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
    });

    it('should generate unique UserIds for different users', () => {
      const userA = User.create(email, password);
      const userB = User.create(email, password);

      expect(userA.id.equals(userB.id)).toBe(false);
    });
  });

  describe('restore', () => {
    it('should restore a User', () => {
      const id = UserId.generate();
      const restoredUser = User.restore(id, email, password);

      expect(restoredUser).toBeInstanceOf(User);
      expect(restoredUser.id).toBe(id);
      expect(restoredUser.email).toBe(email);
      expect(restoredUser.password).toBe(password);
    });

    it('should bypass validation when restoring', () => {
      // Using a placeholder ID to show restore accepts any pre-existing UserId
      const placeholderId = UserId.restore('PLACEHOLDER-ID-1234');
      const restoredUser = User.restore(placeholderId, email, password);

      expect(restoredUser.id).toBe(placeholderId);
    });
  });

  describe('changeEmail', () => {
    it('should update the user email', () => {
      const user = User.create(email, password);
      const newEmail = Email.create('new@example.com');

      user.changeEmail(newEmail);

      expect(user.email).toBe(newEmail);
    });
  });

  describe('changePassword', () => {
    it('should update the user password', () => {
      const user = User.create(email, password);
      const newPassword = HashedPassword.fromHash('b'.repeat(32));

      user.changePassword(newPassword);

      expect(user.password).toBe(newPassword);
    });
  });

  describe('equals', () => {
    it('should return true for the same user instance', () => {
      const user = User.create(email, password);
      expect(user.equals(user)).toBe(true);
    });

    it('should return true for users with the same UserId', () => {
      const id = UserId.generate();
      const user1 = User.restore(id, email, password);
      const user2 = User.restore(id, email, password);

      expect(user1.equals(user2)).toBe(true);
    });

    it('should return false for users with different UserIds', () => {
      const user1 = User.create(email, password);
      const user2 = User.create(email, password);

      expect(user1.equals(user2)).toBe(false);
    });
  });

  describe('accessors', () => {
    it('should return the correct values for id, email, and password', () => {
      const user = User.create(email, password);

      expect(user.id).toBeInstanceOf(UserId);
      expect(user.email).toBe(email);
      expect(user.password).toBe(password);
    });
  });
});
