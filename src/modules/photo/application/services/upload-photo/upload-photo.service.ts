import { AlbumAccessPolicyPort } from '@/modules/album/application/ports/out';
import { AlbumId } from '@/modules/album/domain/value-objects';
import {
  PhotoRepository,
  PhotoStoragePort,
} from '@/modules/photo/application/ports/out';
import { UploadPhotoUseCase } from '@/modules/photo/application/use-cases';
import { UploadPhotoCommand } from '@/modules/photo/application/use-cases/commands';
import { UserId } from '@/modules/user/domain/value-objects';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Photo } from '../../../domain/photo';
import {
  Color,
  FileSize,
  PhotoCreationDate,
  PhotoDescription,
  PhotoLocation,
  PhotoTitle,
} from '../../../domain/value-objects';

@Injectable()
export class UploadPhotoService implements UploadPhotoUseCase {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly accessPolicy: AlbumAccessPolicyPort,
  ) {}

  async execute(command: UploadPhotoCommand): Promise<Photo> {
    const albumId = AlbumId.restore(command.albumId);
    const userId = UserId.restore(command.ownerId);

    const canAccess = await this.accessPolicy.canAccessAlbum(albumId, userId);
    if (!canAccess) throw new ForbiddenException();

    const photoLocation = await this.photoStorage.store(command.photoFile);
    const photo = this.createPhoto(photoLocation, command);
    await this.photoRepository.save(photo);

    return photo;
  }

  // TODO: Consider using a factory.
  private createPhoto(location: PhotoLocation, command: UploadPhotoCommand) {
    return Photo.create(
      AlbumId.restore(command.albumId),
      PhotoTitle.create(command.title),
      PhotoDescription.create(command.description),
      FileSize.fromBytes(command.photoFile.size),
      Color.fromHex('#777777'), // TODO: FIX THIS.
      location,
      PhotoCreationDate.fromNow(),
    );
  }
}
