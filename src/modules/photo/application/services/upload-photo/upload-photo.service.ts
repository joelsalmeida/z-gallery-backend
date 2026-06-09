import { AlbumAccessPolicyPort } from '@/modules/album/application/ports/out';
import { AlbumId } from '@/modules/album/domain/value-objects';
import {
  PhotoRepository,
  PhotoStoragePort,
  PredominantColorExtractorPort,
} from '@/modules/photo/application/ports/out';
import { UploadPhotoUseCase } from '@/modules/photo/application/use-cases';
import { UploadPhotoCommand } from '@/modules/photo/application/use-cases/commands';
import { PhotoUploadedEvent } from '@/modules/photo/domain/events/photo-uploaded.event';
import { UserId } from '@/modules/user/domain/value-objects';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    private eventEmitter: EventEmitter2,
    private readonly predominantColorExtractor: PredominantColorExtractorPort,
  ) {}

  async execute(command: UploadPhotoCommand): Promise<Photo> {
    const albumId = AlbumId.restore(command.albumId);
    const userId = UserId.restore(command.ownerId);

    await this.assertAlbumAccess(albumId, userId);

    const [photoLocation, predominantColor] = await Promise.all([
      this.photoStorage.store(command.photoFile),
      this.predominantColorExtractor.extract(command.photoFile.buffer),
    ]);

    const photo = this.createPhoto(photoLocation, command, predominantColor);
    await this.photoRepository.save(photo);

    this.eventEmitter.emit(
      PhotoUploadedEvent.name,
      new PhotoUploadedEvent(photo.id),
    );

    return photo;
  }

  private async assertAlbumAccess(albumId: AlbumId, userId: UserId) {
    const canAccess = await this.accessPolicy.canAccessAlbum(albumId, userId);
    if (!canAccess) throw new ForbiddenException();
  }

  // TODO: Consider using a factory.
  private createPhoto(
    location: PhotoLocation,
    command: UploadPhotoCommand,
    predominantColor: Color,
  ) {
    return Photo.create(
      AlbumId.restore(command.albumId),
      PhotoTitle.create(command.title),
      PhotoDescription.create(command.description),
      FileSize.fromBytes(command.photoFile.size),
      predominantColor,
      location,
      PhotoCreationDate.fromNow(),
    );
  }
}
