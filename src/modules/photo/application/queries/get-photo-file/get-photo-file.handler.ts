import { UserId } from '@/modules/user/domain/value-objects';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { GetPhotoFile, GetPhotoFileQuery } from '.';
import { PhotoId } from '../../../domain/value-objects';
import { PhotoNotFoundException } from '../../exceptions';
import {
  AlbumReadPort,
  PhotoRepository,
  PhotoStoragePort,
} from '../../ports/out';
import { PhotoFileStream } from '../../ports/out/photo-storage.port';

@Injectable()
export class GetPhotoFileHandler implements GetPhotoFile {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly albumRead: AlbumReadPort,
  ) {}

  async execute(command: GetPhotoFileQuery): Promise<PhotoFileStream> {
    const photo = await this.photoRepository.findById(
      PhotoId.restore(command.photoId),
    );
    if (!photo) throw new PhotoNotFoundException();

    const authorizedUser = await this.albumRead.isOwnedBy(
      photo.albumId,
      UserId.restore(command.requester),
    );
    if (!authorizedUser) throw new ForbiddenException();

    return await this.photoStorage.read(photo.location);
  }
}
