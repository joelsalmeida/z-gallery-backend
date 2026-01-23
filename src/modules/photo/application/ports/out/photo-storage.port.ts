import { PhotoFile, PhotoLocation } from '@/modules/photo/domain/value-objects';
import { Readable } from 'stream';

export class PhotoFileStream {
  constructor(
    public readonly stream: Readable,
    public readonly contentType: string,
    public readonly size: number,
  ) {}
}

export abstract class PhotoStoragePort {
  abstract store(file: PhotoFile): Promise<PhotoLocation>;

  abstract read(location: PhotoLocation): Promise<PhotoFileStream>;

  abstract delete(location: PhotoLocation): Promise<void>;
}
