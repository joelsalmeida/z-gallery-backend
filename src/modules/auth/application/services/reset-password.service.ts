import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserRepository } from '../../../user/application/ports/out';
import { Password } from '../../domain/value-objects';
import {
  PasswordHasherPort,
  PasswordResetTokenRepository,
  TokenHasherPort,
} from '../ports/out';
import { RefreshTokenRepository } from '../ports/out/refresh-token.repository';
import { ResetPasswordUseCase } from '../use-cases';
import { ResetPasswordCommand } from '../use-cases/commands';

@Injectable()
export class ResetPasswordService implements ResetPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly resetTokenRepository: PasswordResetTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenHasher: TokenHasherPort,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<void> {
    const tokenHash = await this.tokenHasher.hash(command.token);

    const resetToken = await this.resetTokenRepository.find(tokenHash);
    if (!resetToken) throw new UnauthorizedException();

    const user = await this.userRepository.findById(
      resetToken.userId.toValue(),
    );
    if (!user) throw new UnauthorizedException();

    resetToken.use();

    const password = Password.fromString(command.newPassword);
    const hashedPassword = await this.passwordHasher.hash(password);
    user.changePassword(hashedPassword);

    // TODO: these operations should be wrapped in a transaction to ensure atomicity.
    await this.userRepository.update(user);
    await this.resetTokenRepository.update(resetToken);
    await this.refreshTokenRepository.deleteAllByUserId(user.id.toValue());
  }
}
