import { LogoutCommand } from './commands';

export abstract class LogoutUseCase {
  abstract execute(command: LogoutCommand): Promise<void>;
}
