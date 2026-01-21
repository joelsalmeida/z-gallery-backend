import { AlbumId } from '@/modules/album/domain/value-objects';
import { Photo } from '@/modules/photo/domain/photo';
import { PhotoId } from '@/modules/photo/domain/value-objects';

export abstract class PhotoRepository {
  abstract save(photo: Photo): Promise<void>;

  abstract findByAlbumId(albumId: AlbumId): Promise<Photo[]>;

  abstract findById(id: PhotoId): Promise<Photo | null>;

  abstract deleteById(id: PhotoId): Promise<void>;

  abstract countByAlbumId(id: AlbumId): Promise<number>;
}
