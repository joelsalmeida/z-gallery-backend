import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';

export abstract class AlbumAccessPolicyPort {
  abstract canAccessAlbum(albumId: AlbumId, userId: UserId): Promise<boolean>;
}
