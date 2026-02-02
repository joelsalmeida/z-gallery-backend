import { AppConfig } from '@/config/app-config';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AppConfig>) => {
        return {
          connection: {
            host: config.get('redis.host', { infer: true }),
            port: config.get('redis.port', { infer: true }),
          },
        };
      },
    }),
  ],
})
export class QueuesModule {}
