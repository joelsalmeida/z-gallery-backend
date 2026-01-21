import { AlbumId } from '@/modules/album/domain/value-objects';
import { AlbumReadPort } from '@/modules/photo/application/ports/out';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAlbumReadRepository implements AlbumReadPort {
  constructor(private readonly prisma: PrismaService) {}

  async existsById(albumId: AlbumId): Promise<boolean> {
    const count = await this.prisma.album.count({
      where: { id: albumId.toValue() },
    });

    return count > 0;
  }

  async isOwnedBy(albumId: AlbumId, ownerId: UserId): Promise<boolean> {
    const count = await this.prisma.album.count({
      where: {
        id: albumId.toValue(),
        ownerId: ownerId.toValue(),
      },
    });

    return count > 0;
  }
}
