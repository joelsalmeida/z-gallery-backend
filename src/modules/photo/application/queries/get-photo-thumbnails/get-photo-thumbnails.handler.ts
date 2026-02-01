import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { GetPhotoThumbnails, GetPhotoThumbnailsQuery } from '.';
import { PhotoViewRepository } from '../../ports/out';
import type { PhotoThumbnailView } from './photo-thumbnails.view.type';

@Injectable()
export class GetPhotoThumbnailsHandler implements GetPhotoThumbnails {
  constructor(private readonly photoRepository: PhotoViewRepository) {}

  async execute(query: GetPhotoThumbnailsQuery): Promise<PhotoThumbnailView[]> {
    return this.photoRepository.findThumbnailsByAlbum(
      AlbumId.restore(query.albumId),
      UserId.restore(query.userId),
    );
  }
}
