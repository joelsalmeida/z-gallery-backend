import { AppConfig } from '@/config/app-config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_PUBSUB = 'REDIS_PUBSUB';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_PUBSUB,
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>) => {
        const host = config.get('redis.host', { infer: true });
        const port = config.get('redis.port', { infer: true });

        return new Redis({
          host,
          port,
        });
      },
    },
  ],
  exports: [REDIS_PUBSUB],
})
export class RedisModule {}
