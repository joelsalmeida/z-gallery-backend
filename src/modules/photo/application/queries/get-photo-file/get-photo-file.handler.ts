import { UserId } from '@/modules/user/domain/value-objects';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetPhotoFile, GetPhotoFileQuery } from '.';
import { PhotoId } from '../../../domain/value-objects';
import { PhotoNotFoundException } from '../../exceptions';
import {
  PhotoAccessPolicyPort,
  PhotoRepository,
  PhotoStoragePort,
} from '../../ports/out';
import { PhotoFileStream } from '../../ports/out/photo-storage.port';

@Injectable()
export class GetPhotoFileHandler implements GetPhotoFile {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly accessPolicy: PhotoAccessPolicyPort,
  ) {}

  async execute(command: GetPhotoFileQuery): Promise<PhotoFileStream> {
    const photoId = PhotoId.restore(command.photoId);
    const photo = await this.photoRepository.findById(photoId);
    if (!photo) throw new PhotoNotFoundException();

    const userId = UserId.restore(command.userId);
    const isAuthorized = await this.accessPolicy.canAccessPhoto(
      photoId,
      userId,
    );
    if (!isAuthorized) throw new ForbiddenException();

    return await this.photoStorage.read(photo.location);
  }
}
