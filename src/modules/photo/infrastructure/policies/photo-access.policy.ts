import { AlbumRepository } from '@/modules/album/application/ports/out';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import {
  PhotoAccessPolicyPort,
  PhotoRepository,
} from '../../application/ports/out';
import { PhotoId } from '../../domain/value-objects';

@Injectable()
export class PhotoAccessPolicy implements PhotoAccessPolicyPort {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async canAccessPhoto(photoId: PhotoId, userId: UserId): Promise<boolean> {
    return this.ownsPhoto(photoId, userId);
  }

  private async ownsPhoto(photoId: PhotoId, userId: UserId): Promise<boolean> {
    const photo = await this.photoRepository.findById(photoId);
    if (!photo) return false;
    return this.albumRepository.isOwnedBy(photo.albumId, userId);
  }
}
