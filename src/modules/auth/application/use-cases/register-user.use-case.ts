import { AuthenticationData } from '../dtos';
import { RegisterUserCommand } from './commands';

export abstract class RegisterUserUseCase {
  abstract execute(command: RegisterUserCommand): Promise<AuthenticationData>;
}
