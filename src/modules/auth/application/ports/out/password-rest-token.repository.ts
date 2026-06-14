import { PasswordResetToken } from '@/modules/auth/domain/value-objects';

export abstract class PasswordResetTokenRepository {
  abstract save(token: PasswordResetToken): Promise<void>;

  abstract update(token: PasswordResetToken): Promise<void>;

  abstract find(token: string): Promise<PasswordResetToken | null>;

  abstract delete(token: PasswordResetToken): Promise<void>;

  abstract deleteAllByUserId(userId: string): Promise<void>;
}
