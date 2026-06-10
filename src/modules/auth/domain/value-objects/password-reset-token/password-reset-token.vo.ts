import { UnauthorizedException } from '@nestjs/common';
import { UserId } from '../../../../user/domain/value-objects';
import { InvalidPasswordResetTokenException } from './exceptions';

// TODO(auth): Refactor RefreshToken and PasswordResetToken to share a common TokenLifecycle pattern
// (expiration, single-use state, restore/equality behavior) and eliminate duplicated lifecycle logic.
export class PasswordResetToken {
  private readonly _value: string;
  private readonly _userId: UserId;
  private readonly _expiresAt: Date;
  private _usedAt: Date | null;

  private constructor(
    value: string,
    userId: UserId,
    expiresAt: Date,
    usedAt: Date | null = null,
  ) {
    this._value = value;
    this._userId = userId;
    this._expiresAt = expiresAt;
    this._usedAt = usedAt;
  }

  // =========================
  // FACTORIES
  // =========================

  static create(value: string, userId: UserId, expiresAt: Date) {
    this.assertValid(userId, expiresAt);
    return new PasswordResetToken(value, userId, expiresAt);
  }

  toValue() {
    return this._value;
  }

  static restore(
    value: string,
    userId: UserId,
    expiresAt: Date,
    usedAt: Date | null = null,
  ) {
    return new PasswordResetToken(value, userId, expiresAt, usedAt);
  }

  // =========================
  // DOMAIN BEHAVIOR (ONLY PUBLIC MUTATION)
  // =========================

  use(userId: UserId): void {
    this.assertUsable(userId);
    this._usedAt = new Date();
  }

  // =========================
  // INTERNAL RULES
  // =========================

  private assertUsable(userId: UserId): void {
    if (this._usedAt !== null) {
      throw new UnauthorizedException();
    }

    if (this.isExpired()) {
      throw new UnauthorizedException();
    }

    if (!this._userId.equals(userId)) {
      throw new UnauthorizedException();
    }
  }

  private isExpired(now: Date = new Date()): boolean {
    return now >= this._expiresAt;
  }

  // =========================
  // VALIDATION (CREATION ONLY)
  // =========================

  private static assertValid(userId: UserId, expiresAt: Date) {
    const NOT_A_USER_ID = !(userId instanceof UserId);
    const NOT_A_DATE = !(expiresAt instanceof Date);
    const ALREADY_EXPIRED = expiresAt <= new Date();

    if (NOT_A_USER_ID || NOT_A_DATE || ALREADY_EXPIRED) {
      throw new InvalidPasswordResetTokenException();
    }
  }

  // =========================
  // MINIMAL READ SURFACE
  // =========================

  get value(): string {
    return this._value;
  }

  get usedAt(): Date | null {
    return this._usedAt ? new Date(this._usedAt) : null;
  }

  get expiresAt(): Date {
    return new Date(this._expiresAt);
  }

  get userId(): UserId {
    return this._userId;
  }
}
