import { AlbumRepository } from '@/modules/album/application/ports/out';
import {
  CreateAlbumService,
  DeleteAlbumService,
} from '@/modules/album/application/services';
import {
  CreateAlbumUseCase,
  DeleteAlbumUseCase,
} from '@/modules/album/application/use-cases';
import { AlbumController } from '@/modules/album/infrastructure/http/controller/album.controller';
import { PrismaAlbumRepository } from '@/modules/album/infrastructure/persistence/prisma-album.repository';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AlbumViewRepository } from './application/ports/out';
import { GetAlbums, GetAlbumsHandler } from './application/queries/get-albums';
import { PrismaAlbumViewRepository } from './infrastructure/persistence/prisma-album-view.repository';

@Module({
  controllers: [AlbumController],
  providers: [
    PrismaService,
    {
      provide: AlbumRepository,
      useClass: PrismaAlbumRepository,
    },
    {
      provide: AlbumViewRepository,
      useClass: PrismaAlbumViewRepository,
    },
    {
      provide: CreateAlbumUseCase,
      useClass: CreateAlbumService,
    },
    {
      provide: DeleteAlbumUseCase,
      useClass: DeleteAlbumService,
    },
    { provide: GetAlbums, useClass: GetAlbumsHandler },
  ],
  exports: [AlbumRepository],
})
export class AlbumModule {}
