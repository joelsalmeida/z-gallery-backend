import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from '../ports/out/refresh-token.repository';
import { LogoutUseCase } from '../use-cases';
import { LogoutCommand } from '../use-cases/commands';

@Injectable()
export class LogoutService implements LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const storedToken = await this.refreshTokenRepository.find(
      command.refreshToken,
    );

    if (!storedToken) return;

    await this.refreshTokenRepository.delete(storedToken);
  }
}
