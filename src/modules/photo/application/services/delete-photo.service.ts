import { AlbumId } from '@/modules/album/domain/value-objects';
import {
  AlbumReadPort,
  PhotoRepository,
  PhotoStoragePort,
} from '@/modules/photo/application/ports/out';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PhotoNotFoundException } from '../exceptions';
import { DeletePhotoCommand } from '../use-cases/commands';
import { DeletePhotoUseCase } from '../use-cases/delete-photo.use-case';

@Injectable()
export class DeletePhotoService implements DeletePhotoUseCase {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly albumReadPort: AlbumReadPort,
  ) {}

  async execute(command: DeletePhotoCommand): Promise<void> {
    const photoId = PhotoId.restore(command.photoId);
    const photo = await this.photoRepository.findById(photoId);

    if (!photo) throw new PhotoNotFoundException();

    const albumId = AlbumId.restore(photo.albumId.toValue());
    const userId = UserId.restore(command.ownerId);
    const isOwner = await this.albumReadPort.isOwnedBy(albumId, userId);

    if (!isOwner) throw new UnauthorizedException();

    await this.photoStorage.delete(photo.location);
    await this.photoRepository.deleteById(photoId);
  }
}
