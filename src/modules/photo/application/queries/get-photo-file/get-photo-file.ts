import { GetPhotoFileQuery } from '.';
import { PhotoFileStream } from '../../ports/out/photo-storage.port';

export abstract class GetPhotoFile {
  abstract execute(command: GetPhotoFileQuery): Promise<PhotoFileStream>;
}
