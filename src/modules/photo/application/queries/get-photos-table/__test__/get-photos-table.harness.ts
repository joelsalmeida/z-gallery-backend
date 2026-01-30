import { PhotoViewRepository } from '../../../ports/out';
import { GetPhotosTableHandler } from '../get-photos-table.handler';

export const buildGetPhotosTableHarness = () => {
  const photoRepository: jest.Mocked<PhotoViewRepository> = {
    findTableRowsByAlbum: jest.fn(),
    findThumbnailsByAlbum: jest.fn(),
    findDetailsById: jest.fn(),
    countByAlbumId: jest.fn(),
  };

  const handler = new GetPhotosTableHandler(photoRepository);

  return {
    handler,
    photoRepository,
  };
};
