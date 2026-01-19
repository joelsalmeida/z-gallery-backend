import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../../generated/prisma/client';
import { AppConfig } from '../../../config/app-config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService<AppConfig>) {
    const databaseUrl = configService.get('database.url', { infer: true });

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({ adapter });
  }
}
