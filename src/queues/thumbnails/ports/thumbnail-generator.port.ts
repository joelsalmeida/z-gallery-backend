import { PhotoFileStream } from '@/modules/photo/application/ports/out/photo-storage.port';

export abstract class ThumbnailGeneratorPort {
  abstract generate(input: PhotoFileStream): Promise<Buffer>;
}
