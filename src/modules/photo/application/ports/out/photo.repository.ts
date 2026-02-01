import { AlbumId } from '@/modules/album/domain/value-objects';
import { Photo } from '@/modules/photo/domain/photo';
import { PhotoId } from '@/modules/photo/domain/value-objects';

export abstract class PhotoRepository {
  // =========================
  // Persistence (domain)
  // =========================

  abstract save(photo: Photo): Promise<void>;

  abstract update(photo: Photo): Promise<void>;

  abstract findById(id: PhotoId): Promise<Photo | null>;

  abstract findAllByAlbumId(albumId: AlbumId): Promise<Photo[]>;

  abstract deleteById(id: PhotoId): Promise<void>;

  abstract exists(id: PhotoId): Promise<boolean>;
}
