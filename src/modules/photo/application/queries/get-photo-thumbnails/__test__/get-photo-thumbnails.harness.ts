import { PhotoViewRepository } from '../../../ports/out';
import { GetPhotoThumbnailsHandler } from '../get-photo-thumbnails.handler';

export const buildGetPhotoThumbnailsHarness = () => {
  const photoRepository: jest.Mocked<PhotoViewRepository> = {
    findTableRowsByAlbum: jest.fn(),
    findThumbnailsByAlbum: jest.fn(),
    findDetailsById: jest.fn(),
    countByAlbumId: jest.fn(),
  };

  const handler = new GetPhotoThumbnailsHandler(photoRepository);

  return {
    handler,
    photoRepository,
  };
};
