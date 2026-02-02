import {
  ThumbnailJobPort,
  ThumbnailStoragePort,
} from '@/modules/photo/application/ports/out';
import { LocalThumbnailStorage } from '@/modules/photo/infrastructure/storage';
import { PhotoPortModule } from '@/modules/photo/photo-port.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullThumbnailQueue } from './infrastructure/bull/bull-thumbnail.queue';
import { SharpThumbnailGenerator } from './infrastructure/generators/sharp-thumbnail-generator';
import { ThumbnailProcessor } from './infrastructure/processors/thumbnail.processor';
import { ThumbnailGeneratorPort } from './ports';
import { THUMBNAIL_QUEUE } from './thumbnail.queue.contract';

@Module({
  imports: [
    BullModule.registerQueue({ name: THUMBNAIL_QUEUE }),
    PhotoPortModule,
  ],
  providers: [
    ThumbnailProcessor,

    BullThumbnailQueue,
    {
      provide: ThumbnailJobPort,
      useClass: BullThumbnailQueue,
    },

    {
      provide: ThumbnailGeneratorPort,
      useClass: SharpThumbnailGenerator,
    },
    {
      provide: ThumbnailStoragePort,
      useClass: LocalThumbnailStorage,
    },
  ],
  exports: [ThumbnailJobPort],
})
export class ThumbnailQueueModule {}
