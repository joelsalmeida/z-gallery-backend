import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { appConfig } from './config/app-config';
import { assertConfig } from './config/assert-config';
import { AlbumModule } from './modules/album/album.module';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { PhotoModule } from './modules/photo/photo.module';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';
import { QueuesModule } from './queues/queues.module';
import { ThumbnailQueueModule } from './queues/thumbnails/thumbnail-queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      validate: assertConfig,
      isGlobal: true,
    }),
    EventEmitterModule.forRoot(),
    QueuesModule,
    ThumbnailQueueModule,
    HealthModule,
    SharedModule,
    AuthModule,
    UserModule,
    AlbumModule,
    PhotoModule,
    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      { path: 'users', module: UserModule },
      {
        path: 'albums',
        module: AlbumModule,
        children: [
          {
            path: ':albumId/photos',
            module: PhotoModule,
          },
        ],
      },
    ]),
  ],
})
export class AppModule {}
