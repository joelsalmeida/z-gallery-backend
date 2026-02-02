import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PhotoDeletedEvent } from '../../domain/events';
import { ThumbnailStoragePort } from '../ports/out';

@Injectable()
export class PhotoDeletedEventHandler {
  constructor(private readonly thumbnailStorage: ThumbnailStoragePort) {}

  @OnEvent(PhotoDeletedEvent.name)
  async handle(event: PhotoDeletedEvent) {
    await this.thumbnailStorage.delete(event.thumbnailLocation);
  }
}
