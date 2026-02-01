import { GetPhotoThumbnailsQuery } from '../get-photo-thumbnails.query';
import { PhotoThumbnailView } from '../photo-thumbnails.view.type';

export const buildGetPhotoThumbnailsFixture = () => {
  const query: GetPhotoThumbnailsQuery = {
    albumId: 'a3b8d6b3-3d8a-4e88-8f77-abcdefabcdef',
    userId: 'user-123',
  };

  const thumbnails: PhotoThumbnailView[] = [
    {
      photoId: 'ee1b00c0-903a-46ed-892f-61cb17ee8de8',
      thumbnailUrl: 'https://cdn.test/photo-1-thumb.jpg',
    },
    {
      photoId: 'b561ef45-835b-4d55-96fb-88eba8b63c0f',
      thumbnailUrl: 'https://cdn.test/photo-2-thumb.jpg',
    },
  ];

  return {
    query,
    thumbnails,
  };
};
