import {
  PhotoRepository,
  PhotoStoragePort,
  ThumbnailStoragePort,
} from '@/modules/photo/application/ports/out';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { BeforeApplicationShutdown } from '@nestjs/common';
import { Job } from 'bullmq';
import { ThumbnailGeneratorPort } from '../../ports';
import {
  THUMBNAIL_JOBS,
  THUMBNAIL_QUEUE,
} from '../../thumbnail.queue.contract';

@Processor(THUMBNAIL_QUEUE, { concurrency: 2 })
export class ThumbnailProcessor
  extends WorkerHost
  implements BeforeApplicationShutdown
{
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly thumbnailGenerator: ThumbnailGeneratorPort,
    private readonly thumbnailStorage: ThumbnailStoragePort,
  ) {
    super();
  }

  async process(job: Job<{ photoId: string }>) {
    switch (job.name) {
      case THUMBNAIL_JOBS.GENERATE:
        return this.generateThumbnail(job);

      default:
        throw new Error(`Unhandled job name: ${job.name}`);
    }
  }

  private async generateThumbnail(job: Job<{ photoId: string }>) {
    const photoId = PhotoId.restore(job.data.photoId);

    const photo = await this.photoRepository.findById(photoId);
    if (!photo) return;

    const photoFile = await this.photoStorage.read(photo.location);
    const thumbBuffer = await this.thumbnailGenerator.generate(photoFile);
    const thumbLocation = await this.thumbnailStorage.store(thumbBuffer);

    photo.attachThumbnail(thumbLocation);
    await this.photoRepository.update(photo);
  }

  async beforeApplicationShutdown(signal: string) {
    console.log(`[ThumbnailWorker] shutdown signal received: ${signal}`);

    if (!this.worker) return;

    await this.worker.pause(true);
    await this.worker.close();

    console.log('[ThumbnailWorker] shutdown complete');
  }
}
