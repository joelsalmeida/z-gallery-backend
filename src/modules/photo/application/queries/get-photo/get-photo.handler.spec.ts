import { ForbiddenException } from '@nestjs/common';
import { PhotoNotFoundException } from '../../exceptions';
import { buildGetPhotoFixture } from './__test__/get-photo.fixtures';
import { buildGetPhotoHarness } from './__test__/get-photo.harness';

describe('GetPhotoHandler – execute', () => {
  let harness: ReturnType<typeof buildGetPhotoHarness>;

  beforeEach(() => {
    harness = buildGetPhotoHarness();
  });

  describe('happy path', () => {
    it('should return photo details when photo exists and user is authorized', async () => {
      const { query, photoView } = buildGetPhotoFixture();

      harness.photoRepository.findDetailsById.mockResolvedValue(photoView);
      harness.accessPolicy.canAccessPhoto.mockResolvedValue(true);

      const result = await harness.handler.execute(query);

      expect(harness.photoRepository.findDetailsById).toHaveBeenCalled();
      expect(harness.accessPolicy.canAccessPhoto).toHaveBeenCalled();

      const [photoIdArg, userIdArg] =
        harness.accessPolicy.canAccessPhoto.mock.calls[0];

      expect(photoIdArg.toValue()).toBe(query.photoId);
      expect(userIdArg.toValue()).toBe(query.userId);

      expect(result).toEqual(photoView);
    });
  });

  describe('negative paths', () => {
    it('should throw PhotoNotFoundException when photo does not exist', async () => {
      const { query } = buildGetPhotoFixture();

      harness.photoRepository.findDetailsById.mockResolvedValue(null);

      await expect(harness.handler.execute(query)).rejects.toBeInstanceOf(
        PhotoNotFoundException,
      );

      expect(harness.accessPolicy.canAccessPhoto).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not authorized', async () => {
      const { query, photoView } = buildGetPhotoFixture();

      harness.photoRepository.findDetailsById.mockResolvedValue(photoView);
      harness.accessPolicy.canAccessPhoto.mockResolvedValue(false);

      await expect(harness.handler.execute(query)).rejects.toBeInstanceOf(
        ForbiddenException,
      );

      expect(harness.photoRepository.findDetailsById).toHaveBeenCalled();
      expect(harness.accessPolicy.canAccessPhoto).toHaveBeenCalled();
    });

    it('should propagate error if repository throws', async () => {
      const { query } = buildGetPhotoFixture();

      const DATABASE_ERROR = new Error('database down');
      harness.photoRepository.findDetailsById.mockRejectedValue(DATABASE_ERROR);

      await expect(harness.handler.execute(query)).rejects.toThrow(
        DATABASE_ERROR,
      );
      expect(harness.accessPolicy.canAccessPhoto).not.toHaveBeenCalled();
    });

    it('should propagate error if access policy throws', async () => {
      const { query, photoView } = buildGetPhotoFixture();

      const POLICE_ERROR = new Error('policy failure');

      harness.photoRepository.findDetailsById.mockResolvedValue(photoView);
      harness.accessPolicy.canAccessPhoto.mockRejectedValue(POLICE_ERROR);

      await expect(harness.handler.execute(query)).rejects.toThrow(
        POLICE_ERROR,
      );
    });
  });

  describe('order of operations', () => {
    it('should check existence before authorization', async () => {
      const { query, photoView } = buildGetPhotoFixture();

      const calls: string[] = [];

      harness.photoRepository.findDetailsById.mockImplementation(async () => {
        calls.push('repository');
        return Promise.resolve(photoView);
      });

      harness.accessPolicy.canAccessPhoto.mockImplementation(async () => {
        calls.push('policy');
        return Promise.resolve(true);
      });

      await harness.handler.execute(query);

      expect(calls).toEqual(['repository', 'policy']);
    });
  });
});
