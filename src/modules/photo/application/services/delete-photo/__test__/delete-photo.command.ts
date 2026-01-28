import { DeletePhotoCommand } from '../../../use-cases/commands';

export const PHOTO_ID = 'e3b8d6b3-3d8a-4e88-8f77-123456789abc';
export const ALBUM_ID = 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1';
export const OWNER_ID = 'u1u1u1u1-u1u1-u1u1-u1u1-u1u1u1u1u1u1';

export const buildDeletePhotoCommand = (
  overrides: Partial<DeletePhotoCommand> = {},
): DeletePhotoCommand => ({
  photoId: PHOTO_ID,
  albumId: ALBUM_ID,
  ownerId: OWNER_ID,
  ...overrides,
});
