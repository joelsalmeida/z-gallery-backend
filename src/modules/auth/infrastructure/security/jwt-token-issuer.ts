import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { User } from 'src/modules/user/domain/user';
import {
  RefreshTokenExpiredException,
  RefreshTokenInvalidException,
} from '../../application/exceptions';
import { RefreshTokenRepository } from '../../application/ports/out/refresh-token.repository';
import { TokenIssuerPort } from '../../application/ports/out/token-issuer.port';
import { RefreshToken } from '../../domain/value-objects';

@Injectable()
export class JwtTokenIssuer implements TokenIssuerPort {
  private readonly accessExpiration: StringValue;
  private readonly refreshExpiration: StringValue;

  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    configService: ConfigService,
  ) {
    this.accessExpiration = configService.getOrThrow('jwt.accessExpiration');
    this.refreshExpiration = configService.getOrThrow('jwt.refreshExpiration');
  }

  async issue(user: User) {
    const payload = { sub: user.id.toValue(), email: user.email.toValue() };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessExpiration,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshExpiration,
    });

    const SECONDS_120 = 120 * 1000;
    const refreshTokenEntity = RefreshToken.create(
      refreshToken,
      user.id,
      new Date(Date.now() + SECONDS_120),
    );

    // TODO: Hash refresh tokens before storing. :)
    // Let's leave it like this for development convenience for now.
    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(token: string) {
    const storedRefreshToken = await this.refreshTokenRepository.find(token);

    if (!storedRefreshToken) {
      throw new RefreshTokenInvalidException();
    }

    if (storedRefreshToken.isExpired()) {
      await this.refreshTokenRepository.delete(storedRefreshToken);
      throw new RefreshTokenExpiredException();
    }

    const payload: { sub: string; email: string } =
      this.jwtService.verify(token);

    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: this.accessExpiration },
    );

    // Optional rotation (recommended)
    const newRefreshToken = this.jwtService.sign(
      { sub: payload.sub, email: payload.email },
      { expiresIn: this.refreshExpiration },
    );

    await this.refreshTokenRepository.delete(storedRefreshToken);

    await this.refreshTokenRepository.save(
      RefreshToken.create(
        newRefreshToken,
        storedRefreshToken.userId,
        new Date(Date.now() + 120 * 1000),
      ),
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
