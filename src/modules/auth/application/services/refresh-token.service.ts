import { Injectable } from '@nestjs/common';
import { RefreshTokenData } from '../dtos/authentication-data.dto';
import { TokenIssuerPort } from '../ports/out';
import { RefreshTokenCommand } from '../use-cases/commands';
import { RefreshTokenUserUseCase } from '../use-cases/refresh-token.use-case';

@Injectable()
export class RefreshTokenService implements RefreshTokenUserUseCase {
  constructor(private readonly tokenIssuer: TokenIssuerPort) {}
  async execute(command: RefreshTokenCommand): Promise<RefreshTokenData> {
    return this.tokenIssuer.refresh(command.refreshToken);
  }
}
