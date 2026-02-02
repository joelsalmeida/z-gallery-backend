import {
  PhotoAccessPolicyPort,
  PhotoRepository,
  PhotoStoragePort,
} from '@/modules/photo/application/ports/out';
import { PhotoDeletedEvent } from '@/modules/photo/domain/events';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PhotoNotFoundException } from '../../exceptions';
import { DeletePhotoCommand } from '../../use-cases/commands';
import { DeletePhotoUseCase } from '../../use-cases/delete-photo.use-case';
import { PhotoOwnershipException } from '../exceptions';

@Injectable()
export class DeletePhotoService implements DeletePhotoUseCase {
  constructor(
    private readonly photoRepository: PhotoRepository,
    private readonly accessPolicy: PhotoAccessPolicyPort,
    private readonly photoStorage: PhotoStoragePort,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute(command: DeletePhotoCommand): Promise<void> {
    const photoId = PhotoId.restore(command.photoId);
    const photo = await this.photoRepository.findById(photoId);

    if (!photo) throw new PhotoNotFoundException();

    const userId = UserId.restore(command.ownerId);
    const isOwner = await this.accessPolicy.canAccessPhoto(photoId, userId);

    if (!isOwner) throw new PhotoOwnershipException();

    await this.photoStorage.delete(photo.location);
    await this.photoRepository.deleteById(photoId);

    if (photo.thumbnailLocation) {
      this.eventEmitter.emit(
        PhotoDeletedEvent.name,
        new PhotoDeletedEvent(photo.thumbnailLocation),
      );
    }
  }
}
