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
import { AlbumReadPort } from '../photo/application/ports/out';
import { PrismaAlbumReadRepository } from './infrastructure/persistence/prisma-album-read.repository';

@Module({
  controllers: [AlbumController],
  providers: [
    PrismaService,
    {
      provide: AlbumRepository,
      useClass: PrismaAlbumRepository,
    },
    {
      provide: AlbumReadPort,
      useClass: PrismaAlbumReadRepository,
    },
    {
      provide: CreateAlbumUseCase,
      useClass: CreateAlbumService,
    },
    {
      provide: DeleteAlbumUseCase,
      useClass: DeleteAlbumService,
    },
  ],
  exports: [AlbumRepository, AlbumReadPort],
})
export class AlbumModule {}
