import { Album } from '../../domain/album';
import { CreateAlbumCommand } from './commands';

export abstract class CreateAlbumUseCase {
  abstract execute(command: CreateAlbumCommand): Promise<Album>;
}
