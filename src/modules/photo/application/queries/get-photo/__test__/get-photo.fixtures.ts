import { GetPhotoQuery } from '../get-photo.query';
import { PhotoDetailsView } from '../photo-details.view.type';
const creationDate = new Date('2024-01-01T10:00:00.000Z');
const uploadDate = new Date('2024-02-02T10:05:00.000Z');

const query: GetPhotoQuery = {
  albumId: '3bf5d560-b34d-4b4b-b5f4-cd4239d19648',
  photoId: 'e3b8d6b3-3d8a-4e88-8f77-123456789abc',
  userId: 'user-123',
};

const photoView: PhotoDetailsView = {
  id: query.photoId,
  albumId: query.albumId,
  title: 'My photo',
  size: 1024,
  predominantColor: '#FFF',
  description: 'Some description',
  creationDate,
  uploadDate,
};

export const buildGetPhotoFixture = () => {
  return {
    query,
    photoView,
  };
};
