import { PhotoFile, PhotoLocation } from '@/modules/photo/domain/value-objects';

export abstract class PhotoStoragePort {
  abstract store(photoId: string, file: PhotoFile): Promise<PhotoLocation>;

  abstract delete(location: PhotoLocation): Promise<void>;
}
