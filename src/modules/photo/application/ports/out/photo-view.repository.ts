import { AlbumId } from '@/modules/album/domain/value-objects';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import type { PhotoThumbnailView } from '../../queries/get-photo-thumbnails/photo-thumbnails.view.type';
import { PhotoDetailsView } from '../../queries/get-photo/photo-details.view.type';
import type { PhotoTableRowView } from '../../queries/get-photos-table/photo-table-row.view.type';

export abstract class PhotoViewRepository {
  // =========================
  // Query projections (read models)
  // =========================

  abstract findTableRowsByAlbum(
    albumId: AlbumId,
    ownerId: UserId,
  ): Promise<PhotoTableRowView[]>;

  abstract findThumbnailsByAlbum(
    albumId: AlbumId,
    ownerId: UserId,
  ): Promise<PhotoThumbnailView[]>;

  abstract findDetailsById(
    photoId: PhotoId,
    ownerId: UserId,
  ): Promise<PhotoDetailsView | null>;

  abstract countByAlbumId(id: AlbumId): Promise<number>;
}
