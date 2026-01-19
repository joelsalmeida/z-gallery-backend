import { User } from '../../domain/user';
import { FindUserByEmailCommand } from './commands';

export abstract class FindUserByEmailUseCase {
  abstract execute(command: FindUserByEmailCommand): Promise<User | null>;
}
