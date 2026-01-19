import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/application/ports/out';
import { User } from 'src/modules/user/domain/user';
import { Email } from 'src/modules/user/domain/value-objects';
import { Password } from '../../domain/value-objects';
import { AuthenticationData } from '../dtos';
import { EmailAlreadyInUseException } from '../exceptions';
import { PasswordHasherPort, TokenIssuerPort } from '../ports/out';
import { RegisterUserUseCase } from '../use-cases';
import { RegisterUserCommand } from '../use-cases/commands';

@Injectable()
export class RegisterUserService implements RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenIssuer: TokenIssuerPort,
  ) {}
  async execute(command: RegisterUserCommand): Promise<AuthenticationData> {
    const email = Email.create(command.email);
    await this.assertEmailAvailability(email);

    const password = Password.fromString(command.password);
    const user = await this.createUser(email, password);

    await this.userRepository.save(user);
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

  private async createUser(email: Email, password: Password) {
    const passwordHash = await this.passwordHasher.hash(password);
    return User.create(email, passwordHash);
  }

  private async assertEmailAvailability(email: Email) {
    const userAlreadyRegistered = await this.userRepository.findByEmail(
      email.toValue(),
    );
    if (userAlreadyRegistered) {
      throw new EmailAlreadyInUseException();
    }
  }
}
