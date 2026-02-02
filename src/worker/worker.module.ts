import { appConfig } from '@/config/app-config';
import { assertConfig } from '@/config/assert-config';
import { SharedModule } from '@/modules/shared/shared.module';
import { QueuesModule } from '@/queues/queues.module';
import { ThumbnailQueueModule } from '@/queues/thumbnails/thumbnail-queue.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validate: assertConfig,
      isGlobal: true,
    }),
    SharedModule,
    QueuesModule,
    ThumbnailQueueModule,
  ],
})
export class WorkerModule {}
