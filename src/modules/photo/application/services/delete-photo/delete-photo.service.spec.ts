import { PhotoNotFoundException } from '../../exceptions';
import { PhotoOwnershipException } from '../exceptions';
import {
  buildDeletePhotoCommand,
  buildDeletePhotoFixture,
  buildDeletePhotoHarness,
} from './__test__';

const expectNoSideEffects = (
  harness: ReturnType<typeof buildDeletePhotoHarness>,
) => {
  expect(harness.photoStorage.delete).not.toHaveBeenCalled();
  expect(harness.photoRepository.deleteById).not.toHaveBeenCalled();
};

describe('DeletePhotoService – execute', () => {
  describe('happy path', () => {
    it('deletes the photo from storage', async () => {
      const harness = buildDeletePhotoHarness();
      const fixture = buildDeletePhotoFixture();

      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);

      await harness.service.execute(buildDeletePhotoCommand());

      expect(harness.photoStorage.delete).toHaveBeenCalledWith(
        fixture.photo.location,
      );
    });

    it('deletes the photo from the repository', async () => {
      const harness = buildDeletePhotoHarness();
      const fixture = buildDeletePhotoFixture();

      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);

      await harness.service.execute(buildDeletePhotoCommand());

      expect(harness.photoRepository.deleteById).toHaveBeenCalledWith(
        fixture.photo.id,
      );
    });

    it('deletes from storage before deleting from repository', async () => {
      const harness = buildDeletePhotoHarness();
      const fixture = buildDeletePhotoFixture();

      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);

      await harness.service.execute(buildDeletePhotoCommand());

      expect(harness.photoStorage.delete).toHaveBeenCalledTimes(1);
      expect(harness.photoRepository.deleteById).toHaveBeenCalledTimes(1);

      const storageCallOrder =
        harness.photoStorage.delete.mock.invocationCallOrder[0];
      const repoCallOrder =
        harness.photoRepository.deleteById.mock.invocationCallOrder[0];

      expect(storageCallOrder).toBeLessThan(repoCallOrder);
    });
  });

  describe('negative paths', () => {
    it('fails when photo is not found', async () => {
      const harness = buildDeletePhotoHarness();

      harness.photoRepository.findById.mockResolvedValueOnce(null);

      const act = () => harness.service.execute(buildDeletePhotoCommand());

      await expect(act).rejects.toThrow(PhotoNotFoundException);
      expectNoSideEffects(harness);
    });

    it('does not delete from repository if storage deletion fails', async () => {
      const harness = buildDeletePhotoHarness();
      const fixture = buildDeletePhotoFixture();

      const STORAGE_ERROR = new Error('Storage down.');

      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);
      harness.photoStorage.delete.mockRejectedValueOnce(STORAGE_ERROR);

      const act = () => harness.service.execute(buildDeletePhotoCommand());

      await expect(act).rejects.toThrow(STORAGE_ERROR);
      expect(harness.photoRepository.deleteById).not.toHaveBeenCalled();
    });

    it('fails when photo does not belong to the owner', async () => {
      const harness = buildDeletePhotoHarness();
      const fixture = buildDeletePhotoFixture();

      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(false);

      const act = () => harness.service.execute(buildDeletePhotoCommand());

      await expect(act).rejects.toThrow(PhotoOwnershipException);
      expectNoSideEffects(harness);
    });
  });
});
