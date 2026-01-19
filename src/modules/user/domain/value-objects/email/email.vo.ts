import { InvalidEmailException } from './exceptions';

export class Email {
  /**
   * Enforces basic email format validation:
   * - Single "@" separator between local and domain parts
   * - Disallows whitespace characters
   * - Requires a domain with at least one dot (e.g., example.com)
   * - Case-insensitive comparison via normalization
   *
   * Note: This is a simplified validation and does not fully implement RFC 5322.
   */
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(email: string): Email {
    const normalized = this.normalize(email);
    this.assertValid(normalized);
    return new Email(normalized);
  }

  /**
   * Restores an Email value object from a persisted source (e.g., database).
   *
   * This method intentionally bypasses validation and normalization and MUST
   * only be used when rehydrating entities from storage where the value was
   * previously created and validated within the domain.
   *
   * Using this method with arbitrary or user-provided input may result in
   * invalid or non-normalized Email instances and should be avoided.
   */
  static restore(email: string) {
    return new Email(email);
  }

  toValue() {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private static assertValid(value: string) {
    const invalidEmailFormat = !Email.EMAIL_REGEX.test(value);
    if (invalidEmailFormat) {
      throw new InvalidEmailException();
    }
  }
}
