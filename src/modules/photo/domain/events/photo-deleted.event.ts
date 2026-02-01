import { ThumbnailLocation } from '../value-objects';

export class PhotoDeletedEvent {
  constructor(public readonly thumbnailLocation: ThumbnailLocation) {}
}
