import { AlbumNotFoundException } from '@/modules/album/application/exceptions';
import { AlbumId } from '@/modules/album/domain/value-objects';
import {
  AlbumReadPort,
  PhotoRepository,
  PhotoStoragePort,
} from '@/modules/photo/application/ports/out';
import { UploadPhotoUseCase } from '@/modules/photo/application/use-cases';
import { UploadPhotoCommand } from '@/modules/photo/application/use-cases/commands';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Photo } from '../../domain/photo';
import {
  Color,
  FileSize,
  PhotoCreationDate,
  PhotoDescription,
  PhotoLocation,
  PhotoTitle,
} from '../../domain/value-objects';

@Injectable()
export class UploadPhotoService implements UploadPhotoUseCase {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly photoStorage: PhotoStoragePort,
    private readonly albumReadPort: AlbumReadPort,
  ) {}

  async execute(command: UploadPhotoCommand): Promise<Photo> {
    const albumId = AlbumId.restore(command.albumId);
    await this.assertAlbumExistence(albumId);

    const ownerId = UserId.restore(command.ownerId);
    await this.assertAuthorization(albumId, ownerId);

    const photo = this.createPhoto(albumId, command);

    const imageLocation = await this.photoStorage.store(
      photo.id.toValue(),
      command.photoFile,
    );

    photo.updateImageLocation(PhotoLocation.create(imageLocation.toValue()));
    await this.photoRepository.save(photo);
    return photo;
  }

  // TODO: FIX THIS METHOD.
  private createPhoto(albumId: AlbumId, command: UploadPhotoCommand) {
    return Photo.create(
      albumId,
      PhotoTitle.create(command.title),
      PhotoDescription.create(command.description),
      FileSize.fromBytes(777),
      Color.fromHex('#777777'),
      PhotoLocation.create('temp'),
      PhotoCreationDate.fromNow(),
    );
  }

  private async assertAuthorization(albumId: AlbumId, ownerId: UserId) {
    const isOwner = await this.albumReadPort.isOwnedBy(albumId, ownerId);
    if (!isOwner) throw new UnauthorizedException();
  }

  private async assertAlbumExistence(albumId: AlbumId) {
    const albumExists = await this.albumReadPort.existsById(
      AlbumId.restore(albumId.toValue()),
    );

    if (!albumExists) throw new AlbumNotFoundException();
  }
}
