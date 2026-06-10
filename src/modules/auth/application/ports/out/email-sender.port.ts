import { Email } from '@/modules/user/domain/value-objects';

export abstract class EmailSenderPort {
  abstract sendPasswordResetEmail(
    email: Email,
    resetUrl: string,
  ): Promise<void>;
}
