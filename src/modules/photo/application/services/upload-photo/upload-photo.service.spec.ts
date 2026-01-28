import { Photo } from '@/modules/photo/domain/photo';
import { PhotoLocation } from '@/modules/photo/domain/value-objects';
import { buildUploadPhotoFixture, buildUploadPhotoHarness } from './__test__';

const arrangeUntilPersistence = (
  harness: ReturnType<typeof buildUploadPhotoHarness>,
  fixture: ReturnType<typeof buildUploadPhotoFixture>,
) => {
  harness.photoStorage.store.mockResolvedValue(fixture.storedLocation);
};

describe('UploadPhotoService – execute', () => {
  describe('happy path', () => {
    let harness: ReturnType<typeof buildUploadPhotoHarness>;
    let fixture: ReturnType<typeof buildUploadPhotoFixture>;

    beforeEach(() => {
      harness = buildUploadPhotoHarness();
      fixture = buildUploadPhotoFixture();
    });

    it('stores the photo file', async () => {
      arrangeUntilPersistence(harness, fixture);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);
      await harness.service.execute(fixture.command);

      expect(harness.photoStorage.store).toHaveBeenCalledWith(
        fixture.photoFile,
      );
    });

    it('persists the created photo', async () => {
      arrangeUntilPersistence(harness, fixture);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      await harness.service.execute(fixture.command);

      expect(harness.photoRepository.save).toHaveBeenCalledWith(
        expect.any(Photo),
      );
    });

    it('calls photoStorage before photoRepository.save', async () => {
      arrangeUntilPersistence(harness, fixture);

      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      await harness.service.execute(fixture.command);

      const storageCallOrder =
        harness.photoStorage.store.mock.invocationCallOrder[0];
      const repoCallOrder =
        harness.photoRepository.save.mock.invocationCallOrder[0];

      expect(storageCallOrder).toBeLessThan(repoCallOrder);
    });

    it('returns the created photo', async () => {
      arrangeUntilPersistence(harness, fixture);

      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      const result = await harness.service.execute(fixture.command);

      expect(result).toBeInstanceOf(Photo);
    });

    it('creates the photo with the correct album id', async () => {
      arrangeUntilPersistence(harness, fixture);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      const photo = await harness.service.execute(fixture.command);

      expect(photo.albumId.toValue()).toBe(fixture.command.albumId);
    });

    it('creates the photo with correct title, description, and size', async () => {
      arrangeUntilPersistence(harness, fixture);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      const photo = await harness.service.execute(fixture.command);

      expect(photo.title.toValue()).toBe(fixture.command.title);
      expect(photo.description.toValue()).toBe(fixture.command.description);
      expect(photo.size.toValue()).toBe(fixture.photoFile.size);
    });

    it('creates the photo with the location returned by storage', async () => {
      const storedLocation = PhotoLocation.create('photos/test.jpg');
      harness.photoStorage.store.mockResolvedValueOnce(storedLocation);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      const photo = await harness.service.execute(fixture.command);

      expect(photo.location.toValue()).toBe(storedLocation.toValue());
    });
  });

  describe('negative paths', () => {
    let harness: ReturnType<typeof buildUploadPhotoHarness>;
    let fixture: ReturnType<typeof buildUploadPhotoFixture>;

    beforeEach(() => {
      harness = buildUploadPhotoHarness();
      fixture = buildUploadPhotoFixture();
    });

    it('propagates error when photoStorage.store throws', async () => {
      const storageError = new Error('Storage failed.');
      harness.photoStorage.store.mockRejectedValueOnce(storageError);
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);

      const act = () => harness.service.execute(fixture.command);

      await expect(act).rejects.toThrow(storageError);
      expect(harness.photoRepository.save).not.toHaveBeenCalled();
    });

    it('propagates error when photoRepository.save throws', async () => {
      arrangeUntilPersistence(harness, fixture);

      const REPOSITORY_ERROR = new Error('Repository save failed.');
      harness.accessPolicy.canAccessAlbum.mockResolvedValueOnce(true);
      harness.photoRepository.save.mockRejectedValueOnce(REPOSITORY_ERROR);

      const act = () => harness.service.execute(fixture.command);

      await expect(act).rejects.toThrow(REPOSITORY_ERROR);
      expect(harness.photoStorage.store).toHaveBeenCalledWith(
        fixture.photoFile,
      );
    });
  });
});
