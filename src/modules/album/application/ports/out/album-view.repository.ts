import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { AlbumView } from '../../queries/get-albums/album.view.type';

export abstract class AlbumViewRepository {
  // =========================
  // Query projections (read models)
  // =========================

  abstract findByOwner(ownerId: UserId): Promise<AlbumView[]>;

  abstract findById(id: AlbumId): Promise<AlbumView | null>;
}
