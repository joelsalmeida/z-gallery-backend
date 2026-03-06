import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { AlbumViewRepository } from '../../application/ports/out';
import { AlbumView } from '../../application/queries/get-albums/album.view.type';
import { AlbumId } from '../../domain/value-objects';

@Injectable()
export class PrismaAlbumViewRepository implements AlbumViewRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findById(id: AlbumId): Promise<AlbumView | null> {
    const album = await this.prisma.album.findUnique({
      where: { id: id.toValue() },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    });

    if (!album) return null;

    return {
      id: album.id,
      title: album.title,
      description: album.description,
      photoCount: album._count.photos,
      createdAt: album.createdAt,
    };
  }

  async findByOwner(ownerId: UserId): Promise<AlbumView[]> {
    const albums = await this.prisma.album.findMany({
      where: { ownerId: ownerId.toValue() },
      include: {
        _count: {
          select: { photos: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      photoCount: album._count.photos,
      createdAt: album.createdAt,
    }));
  }
}
