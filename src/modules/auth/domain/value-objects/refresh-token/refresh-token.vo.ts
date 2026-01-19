import { UserId } from '../../../../user/domain/value-objects';
import { InvalidRefreshTokenException } from './exceptions';

export class RefreshToken {
  private readonly _value: string;
  private readonly _userId: UserId;
  private readonly _expiresAt: Date;

  private constructor(value: string, userId: UserId, expiresAt: Date) {
    this._value = value;
    this._userId = userId;
    this._expiresAt = expiresAt;
  }

  static create(value: string, userId: UserId, expiresAt: Date) {
    this.assertValid(userId, expiresAt);
    return new RefreshToken(value, userId, expiresAt);
  }

  toValue() {
    return this._value;
  }

  isExpired(now = new Date()) {
    return now >= this._expiresAt;
  }

  /**
   * Restores a RefreshToken from persistence.
   *
   * Bypasses validation and MUST only be used with values that were
   * previously created and validated by the domain.
   */
  static restore(value: string, userId: UserId, expiresAt: Date) {
    return new RefreshToken(value, userId, expiresAt);
  }

  equals(other: RefreshToken): boolean {
    return this._value === other._value && this._userId.equals(other._userId);
  }

  private static assertValid(userId: UserId, expiresAt: Date) {
    const NOT_A_USER_ID = !(userId instanceof UserId);
    const NOT_A_DATE = !(expiresAt instanceof Date);
    const ALREADY_EXPIRED = expiresAt <= new Date();

    if (NOT_A_USER_ID || NOT_A_DATE || ALREADY_EXPIRED) {
      throw new InvalidRefreshTokenException();
    }
  }

  get value(): string {
    return this._value;
  }

  get userId(): UserId {
    return this._userId;
  }

  get expiresAt(): Date {
    return new Date(this._expiresAt);
  }
}
