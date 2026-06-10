import { RequestPasswordResetCommand } from './commands';

export abstract class RequestPasswordResetUseCase {
  abstract execute(command: RequestPasswordResetCommand): Promise<void>;
}
