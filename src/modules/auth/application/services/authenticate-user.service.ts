import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../user/application/ports/out';
import { AuthenticationData } from '../dtos';
import { PasswordHasherPort, TokenIssuerPort } from '../ports/out';
import { AuthenticateUserUseCase } from '../use-cases';
import { AuthenticateUserCommand } from '../use-cases/commands';

@Injectable()
export class AuthenticateUserService implements AuthenticateUserUseCase {
  constructor(
    private readonly tokenIssuer: TokenIssuerPort,
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}
  async execute(command: AuthenticateUserCommand): Promise<AuthenticationData> {
    const user = await this.userRepository.findByEmail(command.email);
    if (!user) throw new UnauthorizedException();
    await this.assertPasswordMatches(command.password, user.password.toValue());

    const tokens = await this.tokenIssuer.issue(user);

    const authentication = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id.toValue(),
        email: user.email.toValue(),
      },
    };

    return authentication;
  }

  private async assertPasswordMatches(plain: string, hash: string) {
    const passwordMatches = await this.passwordHasher.matches(plain, hash);
    if (!passwordMatches) {
      throw new UnauthorizedException();
    }
  }
}
