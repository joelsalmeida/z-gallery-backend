import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';

export abstract class AlbumReadPort {
  abstract existsById(albumId: AlbumId): Promise<boolean>;

  abstract isOwnedBy(albumId: AlbumId, userId: UserId): Promise<boolean>;
}
