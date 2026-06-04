import { REDIS_PUBSUB } from '@/modules/shared/redis.module';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RealtimeIntegrationEvent } from '../../domain/events/realtime-integration.event';
import { RealtimeEventPublisherPort } from '../ports/realtime-event-publisher.port';

@Injectable()
export class RedisRealtimeEventPublisher implements RealtimeEventPublisherPort {
  constructor(
    @Inject(REDIS_PUBSUB)
    private readonly redis: Redis,
  ) {}

  async publish(event: RealtimeIntegrationEvent): Promise<void> {
    await this.redis.publish(event.id.toValue(), event.serialize());
  }
}
