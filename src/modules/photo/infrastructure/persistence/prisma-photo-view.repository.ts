import { AlbumId } from '@/modules/album/domain/value-objects';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { PhotoViewRepository } from '../../application/ports/out/photo-view.repository';
import { PhotoThumbnailView } from '../../application/queries/get-photo-thumbnails/photo-thumbnails.view.type';
import { PhotoDetailsView } from '../../application/queries/get-photo/photo-details.view.type';
import { PhotoTableRowView } from '../../application/queries/get-photos-table/photo-table-row.view.type';

@Injectable()
export class PrismaPhotoViewRepository implements PhotoViewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTableRowsByAlbum(albumId: AlbumId): Promise<PhotoTableRowView[]> {
    const photos = await this.prisma.photo.findMany({
      where: { albumId: albumId.toValue() },
      select: {
        id: true,
        title: true,
        size: true,
        predominantColor: true,
        creationDate: true,
        createdAt: true,
      },
    });

    return photos.map((photo) => ({
      id: photo.id,
      title: photo.title,
      size: photo.size,
      predominantColor: photo.predominantColor,
      creationDate: photo.creationDate,
      uploadDate: photo.createdAt,
    }));
  }

  // TODO: Return path from thumbnail when implemented.
  async findThumbnailsByAlbum(albumId: AlbumId): Promise<PhotoThumbnailView[]> {
    const photos = await this.prisma.photo.findMany({
      where: { albumId: albumId.toValue() },
    });

    return photos.map((photo) => ({
      thumbnailUrl: photo.location,
    }));
  }

  async findDetailsById(
    photoId: PhotoId,
    ownerId: UserId,
  ): Promise<PhotoDetailsView | null> {
    const photo = await this.prisma.photo.findFirst({
      where: {
        id: photoId.toValue(),
        album: {
          ownerId: ownerId.toValue(),
        },
      },
    });

    if (!photo) return null;

    return {
      id: photo.id,
      albumId: photo.albumId,
      title: photo.title,
      description: photo.description,
      size: photo.size,
      predominantColor: photo.predominantColor,
      creationDate: photo.creationDate,
      uploadDate: photo.createdAt,
    };
  }

  countByAlbumId(id: AlbumId): Promise<number> {
    return this.prisma.photo.count({
      where: { albumId: id.toValue() },
    });
  }
}
