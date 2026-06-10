import { Email } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { EmailSenderPort } from '../../application/ports/out';

@Injectable()
export class ConsoleEmailSender implements EmailSenderPort {
  sendPasswordResetEmail(email: Email, resetUrl: string): Promise<void> {
    return Promise.resolve(
      console.log(`
        ================ PASSWORD RESET EMAIL ===============
        To: ${email.toValue()}
        Reset URL: ${resetUrl}
        =====================================================
      `),
    );
  }
}
