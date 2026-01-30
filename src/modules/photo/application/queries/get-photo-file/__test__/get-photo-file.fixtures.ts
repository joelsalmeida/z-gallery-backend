import { Photo } from '@/modules/photo/domain/photo';
import { PhotoId, PhotoLocation } from '@/modules/photo/domain/value-objects';
import { PhotoFileStream } from '../../../ports/out/photo-storage.port';
import { GetPhotoFileQuery } from '../get-photo-file.query';

const query: GetPhotoFileQuery = {
  photoId: 'e3b8d6b3-3d8a-4e88-8f77-123456789abc',
  albumId: '3bf5d560-b34d-4b4b-b5f4-cd4239d19648',
  userId: 'user-id',
};

const photo = {
  id: PhotoId.restore(query.photoId),
  location: PhotoLocation.create('photos/test.jpg'),
} as unknown as Photo;

const stream = {
  stream: [],
  contentType: '.jpeg',
  size: 1024,
} as unknown as PhotoFileStream;

export const buildGetPhotoFileFixture = () => {
  return {
    query,
    photo,
    stream,
  };
};
