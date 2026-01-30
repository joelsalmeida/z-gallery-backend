import {
  PhotoAccessPolicyPort,
  PhotoRepository,
  PhotoStoragePort,
} from '../../../ports/out';
import { GetPhotoFileHandler } from '../get-photo-file.handler';

export const buildGetPhotoFileHarness = () => {
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

  const accessPolicy: jest.Mocked<PhotoAccessPolicyPort> = {
    canAccessPhoto: jest.fn(),
  };

  const handler = new GetPhotoFileHandler(
    photoRepository,
    photoStorage,
    accessPolicy,
  );

  return {
    handler,
    photoRepository,
    photoStorage,
    accessPolicy,
  };
};
