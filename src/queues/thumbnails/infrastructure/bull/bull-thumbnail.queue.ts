import { ThumbnailJobPort } from '@/modules/photo/application/ports/out';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import {
  THUMBNAIL_JOBS,
  THUMBNAIL_QUEUE,
} from '../../thumbnail.queue.contract';

export type GenerateThumbnailJob = {
  photoId: string;
};

@Injectable()
export class BullThumbnailQueue implements ThumbnailJobPort {
  private readonly THUMBNAIL_JOB_OPTIONS = {
    attempts: 3,
    backoff: { type: 'exponential', delay: 500 },
  };

  constructor(
    @InjectQueue(THUMBNAIL_QUEUE)
    public readonly queue: Queue<GenerateThumbnailJob>,
  ) {}

  async generateThumbnail(photoId: string) {
    await this.queue.add(
      THUMBNAIL_JOBS.GENERATE,
      {
        photoId,
      },
      this.THUMBNAIL_JOB_OPTIONS,
    );
  }
}
