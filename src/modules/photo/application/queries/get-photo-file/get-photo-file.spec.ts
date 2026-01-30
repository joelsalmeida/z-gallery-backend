import { ForbiddenException } from '@nestjs/common';
import { PhotoNotFoundException } from '../../exceptions';
import { buildGetPhotoFileFixture } from './__test__/get-photo-file.fixtures';
import { buildGetPhotoFileHarness } from './__test__/get-photo-file.harness';

describe('GetPhotoFileHandler – execute', () => {
  let harness: ReturnType<typeof buildGetPhotoFileHarness>;
  let fixture: ReturnType<typeof buildGetPhotoFileFixture>;

  beforeEach(() => {
    harness = buildGetPhotoFileHarness();
    fixture = buildGetPhotoFileFixture();
  });

  describe('happy path', () => {
    it('reads the photo file from storage', async () => {
      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);
      harness.photoStorage.read.mockResolvedValueOnce(fixture.stream);

      const result = await harness.handler.execute(fixture.query);

      expect(harness.photoStorage.read).toHaveBeenCalledWith(
        fixture.photo.location,
      );
      expect(result).toBe(fixture.stream);
    });

    it('checks repository, then policy, then storage (order of operations)', async () => {
      const calls: string[] = [];

      harness.photoRepository.findById.mockImplementation(() => {
        calls.push('repository');
        return Promise.resolve(fixture.photo);
      });

      harness.accessPolicy.canAccessPhoto.mockImplementation(() => {
        calls.push('policy');
        return Promise.resolve(true);
      });

      harness.photoStorage.read.mockImplementation(() => {
        calls.push('storage');
        return Promise.resolve(fixture.stream);
      });

      await harness.handler.execute(fixture.query);
      expect(calls).toEqual(['repository', 'policy', 'storage']);
    });
  });

  describe('negative paths', () => {
    it('fails when photo is not found', async () => {
      harness.photoRepository.findById.mockResolvedValueOnce(null);

      const act = () => harness.handler.execute(fixture.query);

      await expect(act).rejects.toThrow(PhotoNotFoundException);
      expect(harness.accessPolicy.canAccessPhoto).not.toHaveBeenCalled();
      expect(harness.photoStorage.read).not.toHaveBeenCalled();
    });

    it('fails when user is not authorized', async () => {
      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(false);

      const act = () => harness.handler.execute(fixture.query);

      await expect(act).rejects.toThrow(ForbiddenException);
      expect(harness.photoStorage.read).not.toHaveBeenCalled();
    });

    it('propagates error when storage read fails', async () => {
      harness.photoRepository.findById.mockResolvedValueOnce(fixture.photo);
      harness.accessPolicy.canAccessPhoto.mockResolvedValueOnce(true);

      const STORAGE_ERROR = new Error('Storage unavailable');
      harness.photoStorage.read.mockRejectedValueOnce(STORAGE_ERROR);

      const act = () => harness.handler.execute(fixture.query);

      await expect(act).rejects.toThrow(STORAGE_ERROR);
    });
  });
});
