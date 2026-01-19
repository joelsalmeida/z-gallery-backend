import { InvalidHashedPasswordException } from './exceptions';

export class HashedPassword {
  private static readonly MIN_LENGTH = 32;
  private static readonly MAX_LENGTH = 255;

  // Allows base64, base64url, hex, and most PHC-style hashes.
  private static readonly HASH_REGEX = /^[A-Za-z0-9+/=._$-]+$/;

  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static fromHash(hash: string): HashedPassword {
    this.assertValid(hash);

    const value = hash.trim();

    return new HashedPassword(value);
  }

  /**
   * Restores a HashedPassword from persistence.
   *
   * This method bypasses validation and MUST only be used when rehydrating
   * domain entities from trusted storage where the hash was previously
   * created and validated by the domain.
   */
  static restore(hash: string): HashedPassword {
    return new HashedPassword(hash);
  }

  toValue(): string {
    return this._value;
  }

  equals(other: HashedPassword): boolean {
    return this._value === other._value;
  }

  private static assertValid(hash: string): void {
    if (typeof hash !== 'string') {
      throw new InvalidHashedPasswordException();
    }

    const value = hash.trim();

    if (value.length < this.MIN_LENGTH || value.length > this.MAX_LENGTH) {
      throw new InvalidHashedPasswordException();
    }

    if (!this.HASH_REGEX.test(value)) {
      throw new InvalidHashedPasswordException();
    }
  }
}
