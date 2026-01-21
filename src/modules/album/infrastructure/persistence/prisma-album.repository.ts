import { AlbumRepository } from '@/modules/album/application/ports/out';
import { Album } from '@/modules/album/domain/album';
import {
  AlbumDescription,
  AlbumId,
  AlbumTitle,
} from '@/modules/album/domain/value-objects';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAlbumRepository implements AlbumRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(album: Album): Promise<void> {
    await this.prisma.album.upsert({
      where: { id: album.id.toValue() },
      update: {
        title: album.title.toValue(),
        description: album.description.toValue(),
        updatedAt: new Date(),
      },
      create: {
        id: album.id.toValue(),
        ownerId: album.ownerId.toValue(),
        title: album.title.toValue(),
        description: album.description.toValue(),
      },
    });
  }

  async findByOwner(ownerId: UserId): Promise<Album[]> {
    const records = await this.prisma.album.findMany({
      where: {
        ownerId: ownerId.toValue(),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      Album.restore(
        AlbumId.restore(record.id),
        UserId.restore(record.ownerId),
        AlbumTitle.restore(record.title),
        AlbumDescription.restore(record.description),
      ),
    );
  }

  async findById(id: AlbumId): Promise<Album | null> {
    const record = await this.prisma.album.findUnique({
      where: { id: id.toValue() },
    });

    if (!record) return null;

    return Album.restore(
      AlbumId.restore(record.id),
      UserId.restore(record.ownerId),
      AlbumTitle.restore(record.title),
      AlbumDescription.restore(record.description),
    );
  }

  async findByIdAndOwner(id: AlbumId, ownerId: UserId): Promise<Album | null> {
    const record = await this.prisma.album.findFirst({
      where: {
        id: id.toValue(),
        ownerId: ownerId.toValue(),
      },
    });

    if (!record) return null;

    return Album.restore(
      AlbumId.restore(record.id),
      UserId.restore(record.ownerId),
      AlbumTitle.restore(record.title),
      AlbumDescription.restore(record.description),
    );
  }

  async deleteById(id: AlbumId): Promise<void> {
    await this.prisma.album.delete({
      where: { id: id.toValue() },
    });
  }
}
