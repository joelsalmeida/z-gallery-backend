import { PhotoAccessPolicyPort, PhotoViewRepository } from '../../../ports/out';
import { GetPhotoHandler } from '../get-photo.handler';

export const buildGetPhotoHarness = () => {
  const photoRepository: jest.Mocked<PhotoViewRepository> = {
    findTableRowsByAlbum: jest.fn(),
    findThumbnailsByAlbum: jest.fn(),
    findDetailsById: jest.fn(),
    countByAlbumId: jest.fn(),
  };

  const accessPolicy: jest.Mocked<PhotoAccessPolicyPort> = {
    canAccessPhoto: jest.fn(),
  };

  const handler = new GetPhotoHandler(photoRepository, accessPolicy);

  return {
    handler,
    photoRepository,
    accessPolicy,
  };
};
