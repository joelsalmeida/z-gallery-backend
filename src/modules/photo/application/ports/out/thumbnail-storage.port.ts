import { ThumbnailLocation } from '@/modules/photo/domain/value-objects';
import { Readable } from 'stream';

export class ThumbnailFileStream {
  constructor(
    public readonly stream: Readable,
    public readonly contentType: string,
    public readonly size: number,
  ) {}
}

export abstract class ThumbnailStoragePort {
  abstract store(buffer: Buffer): Promise<ThumbnailLocation>;

  abstract read(location: ThumbnailLocation): Promise<ThumbnailFileStream>;

  abstract delete(location: ThumbnailLocation): Promise<void>;
}
