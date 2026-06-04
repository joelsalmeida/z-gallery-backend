import { RealtimeEventHandlerRegistry } from '@/modules/shared/realtime/realtime-event-handler-registry';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RealtimeGatewayPort } from './application/ports/realtime-gateway.port';
import { RealtimeEventId } from './domain/value-objects';

@Injectable()
export class RedisRealtimeEventSubscriber
  implements OnModuleInit, OnModuleDestroy
{
  private subscriber!: Redis;

  constructor(
    private readonly gateway: RealtimeGatewayPort,
    private readonly config: ConfigService,
    private readonly registry: RealtimeEventHandlerRegistry,
  ) {}

  async onModuleInit() {
    this.subscriber = new Redis({
      host: this.config.getOrThrow('REDIS_HOST'),
      port: this.config.getOrThrow('REDIS_PORT'),
    });

    await this.subscriber.psubscribe('*');

    this.subscriber.on('pmessage', this.handleMessage);
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
  }

  private handleMessage = (_: string, channel: string, payload: string) => {
    const eventName = RealtimeEventId.create(channel);

    const handler = this.registry.get(eventName);

    if (!handler) return;

    const event = handler.deserialize(payload);
    const key = handler.getKey(event);

    this.gateway.notify(key, event);
  };
}
