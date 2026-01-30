import { PhotoId } from '@/modules/photo/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetPhoto, GetPhotoQuery } from '.';
import { PhotoNotFoundException } from '../../exceptions';
import { PhotoAccessPolicyPort, PhotoViewRepository } from '../../ports/out';
import { PhotoDetailsView } from './photo-details.view.type';

@Injectable()
export class GetPhotoHandler implements GetPhoto {
  constructor(
    private readonly photoRepository: PhotoViewRepository,
    private readonly accessPolicy: PhotoAccessPolicyPort,
  ) {}

  async execute(query: GetPhotoQuery): Promise<PhotoDetailsView> {
    const photoId = PhotoId.restore(query.photoId);
    const userId = UserId.restore(query.userId);

    const photo = await this.photoRepository.findDetailsById(photoId, userId);
    if (!photo) throw new PhotoNotFoundException();

    const isAuthorized = await this.accessPolicy.canAccessPhoto(
      photoId,
      userId,
    );
    if (!isAuthorized) throw new ForbiddenException();

    return photo;
  }
}
