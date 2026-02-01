import { PhotoId } from '../value-objects';

export class PhotoUploadedEvent {
  constructor(public readonly photoId: PhotoId) {}
}
