import { Module } from '@nestjs/common';

import { RedisModule } from '../redis.module';
import { RealtimeEventPublisherPort } from './application/ports';
import { RedisRealtimeEventPublisher } from './application/services/redis-realtime-event.publisher';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: RealtimeEventPublisherPort,
      useClass: RedisRealtimeEventPublisher,
    },
  ],
  exports: [RealtimeEventPublisherPort],
})
export class RealtimePublisherModule {}
