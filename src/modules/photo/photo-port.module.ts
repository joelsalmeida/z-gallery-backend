import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  PhotoRepository,
  PhotoStoragePort,
  ThumbnailStoragePort,
} from './application/ports/out';
import { PrismaPhotoRepository } from './infrastructure/persistence';
import {
  LocalPhotoStorage,
  LocalThumbnailStorage,
} from './infrastructure/storage';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PhotoRepository,
      useClass: PrismaPhotoRepository,
    },
    {
      provide: PhotoStoragePort,
      useClass: LocalPhotoStorage,
    },
    {
      provide: ThumbnailStoragePort,
      useClass: LocalThumbnailStorage,
    },
  ],
  exports: [PhotoRepository, PhotoStoragePort, ThumbnailStoragePort],
})
export class PhotoPortModule {}
