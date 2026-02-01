import { GetPhotoThumbnailsQuery } from '.';
import type { PhotoThumbnailView } from './photo-thumbnails.view.type';

export abstract class GetPhotoThumbnails {
  abstract execute(
    query: GetPhotoThumbnailsQuery,
  ): Promise<PhotoThumbnailView[]>;
}
