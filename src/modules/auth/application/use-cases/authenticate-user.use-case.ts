import { AuthenticationData } from '../dtos';
import { AuthenticateUserCommand } from './commands';

export abstract class AuthenticateUserUseCase {
  abstract execute(
    command: AuthenticateUserCommand,
  ): Promise<AuthenticationData>;
}
