import { Photo } from '../../domain/photo';
import { UploadPhotoCommand } from './commands';

export abstract class UploadPhotoUseCase {
  abstract execute(command: UploadPhotoCommand): Promise<Photo>;
}
