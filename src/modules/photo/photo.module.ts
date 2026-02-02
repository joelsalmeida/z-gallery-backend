import { ThumbnailQueueModule } from '@/queues/thumbnails/thumbnail-queue.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AlbumModule } from '../album/album.module';
import { AlbumAccessPolicyPort } from '../album/application/ports/out';
import { AlbumAccessPolicy } from '../album/infrastructure/policies/album-access-policy';
import { PhotoDeletedEventHandler } from './application/event-handlers/photo-deleted.event-handler';
import { PhotoUploadedEventHandler } from './application/event-handlers/photo-uploaded.event-handler';
import {
  PhotoAccessPolicyPort,
  PhotoViewRepository,
} from './application/ports/out';
import { GetPhoto, GetPhotoHandler } from './application/queries/get-photo';
import {
  GetPhotoFile,
  GetPhotoFileHandler,
} from './application/queries/get-photo-file';
import {
  GetPhotoThumbnails,
  GetPhotoThumbnailsHandler,
} from './application/queries/get-photo-thumbnails';
import {
  GetPhotosTable,
  GetPhotosTableHandler,
} from './application/queries/get-photos-table';
import {
  GetThumbnailFile,
  GetThumbnailFileHandler,
} from './application/queries/get-thumbnail-file';
import { DeletePhotoService, UploadPhotoService } from './application/services';
import {
  DeletePhotoUseCase,
  UploadPhotoUseCase,
} from './application/use-cases';
import { PhotoController } from './infrastructure/http/controller/photo.controller';
import { PrismaPhotoViewRepository } from './infrastructure/persistence';
import { PhotoAccessPolicy } from './infrastructure/policies/photo-access.policy';
import { PhotoPortModule } from './photo-port.module';

@Module({
  imports: [ConfigModule, AlbumModule, ThumbnailQueueModule, PhotoPortModule],
  controllers: [PhotoController],
  providers: [
    {
      provide: PhotoViewRepository,
      useClass: PrismaPhotoViewRepository,
    },
    {
      provide: PhotoAccessPolicyPort,
      useClass: PhotoAccessPolicy,
    },
    {
      provide: AlbumAccessPolicyPort,
      useClass: AlbumAccessPolicy,
    },
    {
      provide: UploadPhotoUseCase,
      useClass: UploadPhotoService,
    },
    {
      provide: DeletePhotoUseCase,
      useClass: DeletePhotoService,
    },
    {
      provide: GetPhotoFile,
      useClass: GetPhotoFileHandler,
    },
    {
      provide: GetThumbnailFile,
      useClass: GetThumbnailFileHandler,
    },
    {
      provide: GetPhotosTable,
      useClass: GetPhotosTableHandler,
    },
    {
      provide: GetPhotoThumbnails,
      useClass: GetPhotoThumbnailsHandler,
    },
    {
      provide: GetPhoto,
      useClass: GetPhotoHandler,
    },
    PhotoUploadedEventHandler,
    PhotoDeletedEventHandler,
  ],
  exports: [UploadPhotoUseCase, DeletePhotoUseCase, GetPhotoFile],
})
export class PhotoModule {}
