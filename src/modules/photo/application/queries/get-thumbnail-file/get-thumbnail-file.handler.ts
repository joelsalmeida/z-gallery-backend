import { UserId } from '@/modules/user/domain/value-objects';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetThumbnailFile, GetThumbnailFileQuery } from '.';
import { PhotoId } from '../../../domain/value-objects';
import { PhotoNotFoundException } from '../../exceptions';
import {
  PhotoAccessPolicyPort,
  PhotoRepository,
  ThumbnailFileStream,
  ThumbnailStoragePort,
} from '../../ports/out';

@Injectable()
export class GetThumbnailFileHandler implements GetThumbnailFile {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly thumbnailStorage: ThumbnailStoragePort,
    private readonly accessPolicy: PhotoAccessPolicyPort,
  ) {}

  async execute(command: GetThumbnailFileQuery): Promise<ThumbnailFileStream> {
    const photoId = PhotoId.restore(command.photoId);
    const photo = await this.photoRepository.findById(photoId);

    if (!photo) throw new PhotoNotFoundException();
    if (!photo.thumbnailLocation) throw new NotFoundException();

    const userId = UserId.restore(command.userId);
    const isAuthorized = await this.accessPolicy.canAccessPhoto(
      photoId,
      userId,
    );
    if (!isAuthorized) throw new ForbiddenException();

    return this.thumbnailStorage.read(photo.thumbnailLocation);
  }
}
