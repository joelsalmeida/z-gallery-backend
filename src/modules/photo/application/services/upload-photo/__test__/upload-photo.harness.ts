import { AlbumAccessPolicyPort } from '@/modules/album/application/ports/out';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PhotoRepository, PhotoStoragePort } from '../../../ports/out';
import { UploadPhotoService } from '../../upload-photo/upload-photo.service';

export interface DomainEventEmitter {
  emit(eventName: string, payload?: unknown): void;
}

interface UploadPhotoHarness {
  readonly service: UploadPhotoService;
  readonly photoRepository: jest.Mocked<PhotoRepository>;
  readonly photoStorage: jest.Mocked<PhotoStoragePort>;
  readonly accessPolicy: jest.Mocked<AlbumAccessPolicyPort>;
  readonly eventEmitter: DomainEventEmitter;
}

export const buildUploadPhotoHarness = (): UploadPhotoHarness => {
  const photoRepository: jest.Mocked<PhotoRepository> = {
    save: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAllByAlbumId: jest.fn(),
    deleteById: jest.fn(),
    exists: jest.fn(),
  };

  const photoStorage: jest.Mocked<PhotoStoragePort> = {
    store: jest.fn(),
    read: jest.fn(),
    delete: jest.fn(),
  };

  const accessPolicy: jest.Mocked<AlbumAccessPolicyPort> = {
    canAccessAlbum: jest.fn(),
  };

  const eventEmitter: jest.Mocked<DomainEventEmitter> = { emit: jest.fn() };

  const service = new UploadPhotoService(
    photoRepository,
    photoStorage,
    accessPolicy,
    eventEmitter as unknown as EventEmitter2,
  );

  return {
    service,
    photoRepository,
    photoStorage,
    accessPolicy,
    eventEmitter,
  };
};
