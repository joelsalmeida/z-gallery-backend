import { PhotoFile, PhotoLocation } from '@/modules/photo/domain/value-objects';
import { UploadPhotoCommand } from '../../../use-cases/commands';

interface UploadPhotoFixture {
  readonly photoFile: PhotoFile;
  readonly command: UploadPhotoCommand;
  readonly storedLocation: PhotoLocation;
}

export const buildUploadPhotoFixture = (): UploadPhotoFixture => {
  const photoFile = PhotoFile.create(
    Buffer.from('fake-image'),
    'image/jpeg',
    'photo.jpg',
  );

  Object.defineProperty(photoFile, 'size', {
    value: 1024,
  });

  const command = new UploadPhotoCommand(
    photoFile,
    'e3b8d6b3-3d8a-4e88-8f77-123456789abc',
    'user-123',
    'My photo',
    'Some description',
  );

  const storedLocation = PhotoLocation.create('photos/2024/abc.jpg');

  return {
    photoFile,
    command,
    storedLocation,
  };
};
