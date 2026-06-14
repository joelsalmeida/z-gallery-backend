import { appConfig } from '@/config/app-config';
import { Injectable, Logger } from '@nestjs/common';

import {
  EmailSenderPort,
  PasswordResetEmailData,
} from '../../application/ports/out/email-sender.port';

@Injectable()
export class ConsoleEmailSender implements EmailSenderPort {
  private readonly logger = new Logger(ConsoleEmailSender.name);

  sendPasswordResetEmail(data: PasswordResetEmailData): Promise<void> {
    const webClientResetUrl =
      `${appConfig().webClient}/reset-password` +
      `?token=${encodeURIComponent(data.token)}`;

    return Promise.resolve(
      this.logger.log(`
        ==================================================
        PASSWORD RESET EMAIL
        ==================================================
        To: ${data.email}

        Reset your password using the link below:
        ${webClientResetUrl}
        ==================================================
      `),
    );
  }
}
