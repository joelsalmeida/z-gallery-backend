export abstract class ThumbnailJobPort {
  abstract generateThumbnail(photoId: string): Promise<void>;
}
