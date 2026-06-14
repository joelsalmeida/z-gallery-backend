import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import ms from 'ms';

import { UserRepository } from '../../../user/application/ports/out';
import { PasswordResetToken } from '../../domain/value-objects/password-reset-token/password-reset-token.vo';
import { PasswordResetTokenRepository, TokenHasherPort } from '../ports/out';
import { EmailSenderPort } from '../ports/out/email-sender.port';
import { RequestPasswordResetUseCase } from '../use-cases';
import { RequestPasswordResetCommand } from '../use-cases/commands';

@Injectable()
export class RequestPasswordResetService implements RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly resetTokenRepository: PasswordResetTokenRepository,
    private readonly emailSender: EmailSenderPort,
    private readonly tokenHasher: TokenHasherPort,
  ) {}

  async execute(command: RequestPasswordResetCommand): Promise<void> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) return;

    const rawToken = randomUUID();
    const tokenHash = await this.tokenHasher.hash(rawToken);
    const expiresAt = new Date(Date.now() + ms('15m'));

    const resetToken = PasswordResetToken.create(tokenHash, user.id, expiresAt);

    // TODO: these operations should be wrapped in a transaction to ensure atomicity.
    // Tokens may also need to be retained for audit and incident investigation purposes.
    // A retention policy could be defined to balance security and privacy requirements,
    // allowing tokens (or token identifiers) to be kept for a limited period
    // to support the analysis of suspicious or anomalous behavior
    // and removed once they are no longer needed.
    await this.resetTokenRepository.deleteAllByUserId(user.id.toValue());
    await this.resetTokenRepository.save(resetToken);

    await this.emailSender.sendPasswordResetEmail({
      email: user.email.toValue(),
      token: rawToken,
    });
  }
}
