import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestHandler } from 'express';
import { AppModule } from './app.module';
import type { AppConfig } from './config/app-config';
import { BullThumbnailQueue } from './queues/thumbnails/infrastructure/bull/bull-thumbnail.queue';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService: ConfigService<AppConfig> = app.get(
    ConfigService<AppConfig>,
  );

  // TODO: dev only.
  const bullThumbnailsQueue = app.get(BullThumbnailQueue);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: [new BullMQAdapter(bullThumbnailsQueue.queue)],
    serverAdapter,
  });

  app
    .getHttpAdapter()
    .getInstance()
    .use('/admin/queues', serverAdapter.getRouter() as RequestHandler);

  const port = configService.get('port', { infer: true }) ?? 3000;

  const config = new DocumentBuilder()
    .setTitle('Z-Gallery API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  Logger.error('Failed to start application: ', err);
  process.exit(1);
});
