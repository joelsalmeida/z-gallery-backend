import { LogOutCommand } from './commands';

export abstract class LogOutUseCase {
  abstract execute(command: LogOutCommand): Promise<void>;
}
