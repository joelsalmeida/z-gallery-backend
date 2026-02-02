import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  PhotoAccessPolicyPort,
  PhotoRepository,
  PhotoStoragePort,
} from '../../../ports/out';
import { DeletePhotoService } from '../delete-photo.service';

export const buildDeletePhotoHarness = () => {
  const photoRepository: jest.Mocked<PhotoRepository> = {
    save: jest.fn(),
    update: jest.fn(),
    findById: jest.fn(),
    findAllByAlbumId: jest.fn(),
    deleteById: jest.fn(),
    exists: jest.fn(),
  };

  const accessPolicy: jest.Mocked<PhotoAccessPolicyPort> = {
    canAccessPhoto: jest.fn(),
  };

  const photoStorage: jest.Mocked<PhotoStoragePort> = {
    store: jest.fn(),
    read: jest.fn(),
    delete: jest.fn(),
  };

  const eventEmitter = { emit: jest.fn() };

  const service = new DeletePhotoService(
    photoRepository,
    accessPolicy,
    photoStorage,
    eventEmitter as unknown as EventEmitter2,
  );

  return {
    service,
    photoRepository,
    accessPolicy,
    photoStorage,
    eventEmitter,
  };
};
