import { DeleteAlbumCommand } from './commands';

export abstract class DeleteAlbumUseCase {
  abstract execute(command: DeleteAlbumCommand): Promise<void>;
}
