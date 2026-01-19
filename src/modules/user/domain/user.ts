import { Email, HashedPassword, UserId } from './value-objects';

export class User {
  private readonly _id: UserId;
  private _password: HashedPassword;
  private _email: Email;

  private constructor(id: UserId, email: Email, password: HashedPassword) {
    this._id = id;
    this._email = email;
    this._password = password;
  }

  /**
   * Creates a new User with a generated UserId.
   *
   * Note: Validation is guaranteed by the Email and HashedPassword
   * value objects. It is assumed that these instances are valid.
   */
  static create(email: Email, password: HashedPassword) {
    return new User(UserId.generate(), email, password);
  }

  /**
   * Restores a User from persistence.
   *
   * This method bypasses validation and MUST only be used when rehydrating
   * entities that were previously created and validated by the domain.
   */
  static restore(id: UserId, email: Email, password: HashedPassword) {
    return new User(id, email, password);
  }

  changeEmail(email: Email) {
    this._email = email;
  }

  changePassword(password: HashedPassword) {
    this._password = password;
  }

  equals(other: User): boolean {
    return this._id.equals(other._id);
  }

  get id(): UserId {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get password(): HashedPassword {
    return this._password;
  }
}
