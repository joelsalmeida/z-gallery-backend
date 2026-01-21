import { LocalPhotoStorage } from '@/modules/photo/infrastructure/persistence/storage';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlbumModule } from '../album/album.module';
import { PhotoRepository, PhotoStoragePort } from './application/ports/out';
import { DeletePhotoService, UploadPhotoService } from './application/services';
import {
  DeletePhotoUseCase,
  UploadPhotoUseCase,
} from './application/use-cases';
import { PhotoController } from './infrastructure/http/controller/photo.controller';
import { PrismaPhotoRepository } from './infrastructure/persistence/prisma-photo.repository';

@Module({
  imports: [ConfigModule, AlbumModule],
  controllers: [PhotoController],
  providers: [
    PrismaService,
    {
      provide: PhotoRepository,
      useClass: PrismaPhotoRepository,
    },
    {
      provide: PhotoStoragePort,
      useClass: LocalPhotoStorage,
    },
    {
      provide: UploadPhotoUseCase,
      useClass: UploadPhotoService,
    },
    {
      provide: DeletePhotoUseCase,
      useClass: DeletePhotoService,
    },
  ],
  exports: [PhotoRepository, PhotoStoragePort, UploadPhotoUseCase],
})
export class PhotoModule {}
