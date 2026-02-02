import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PhotoUploadedEvent } from '../../domain/events';
import { ThumbnailJobPort } from '../ports/out';

@Injectable()
export class PhotoUploadedEventHandler {
  constructor(private readonly thumbnailJob: ThumbnailJobPort) {}

  @OnEvent(PhotoUploadedEvent.name)
  async handle(event: PhotoUploadedEvent) {
    await this.thumbnailJob.generateThumbnail(event.photoId.toValue());
  }
}
