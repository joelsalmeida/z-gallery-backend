import { ResetPasswordCommand } from './commands';

export abstract class ResetPasswordUseCase {
  abstract execute(command: ResetPasswordCommand): Promise<void>;
}
