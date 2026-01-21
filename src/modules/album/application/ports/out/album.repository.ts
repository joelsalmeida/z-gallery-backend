import { Album } from '@/modules/album/domain/album';
import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';

export abstract class AlbumRepository {
  abstract save(album: Album): Promise<void>;

  abstract findById(id: AlbumId): Promise<Album | null>;

  abstract findByOwner(id: UserId): Promise<Album[]>;

  abstract findByIdAndOwner(
    id: AlbumId,
    ownerId: UserId,
  ): Promise<Album | null>;

  abstract deleteById(id: AlbumId): Promise<void>;
}
