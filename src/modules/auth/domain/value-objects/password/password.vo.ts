import { InvalidPasswordException } from './exceptions';

export class Password {
  /**
   * Enforces password complexity requirements:
   * - Minimum length: 12 characters
   * - Required character classes:
   *   - Lowercase alphabetic (a–z)
   *   - Uppercase alphabetic (A–Z)
   *   - Numeric (0–9)
   *   - Special characters (non-alphanumeric)
   */
  private static readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromString(password: string): Password {
    this.assertValid(password);
    return new Password(password);
  }

  /**
   * Returns the plaintext representation of the password.
   *
   * This method is intended for short-lived, controlled use cases
   * such as password hashing during authentication or registration.
   *
   * The returned value must not be persisted, logged, or exposed
   * beyond the application boundary.
   */
  exposeValue() {
    return this._value;
  }

  private static assertValid(password: string) {
    if (typeof password !== 'string') {
      throw new InvalidPasswordException();
    }
    const invalidPasswordFormat = !Password.PASSWORD_REGEX.test(password);
    if (invalidPasswordFormat) {
      throw new InvalidPasswordException();
    }
  }
}
