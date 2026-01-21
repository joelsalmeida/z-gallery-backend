import { DeletePhotoCommand } from './commands';

export abstract class DeletePhotoUseCase {
  abstract execute(command: DeletePhotoCommand): Promise<void>;
}
