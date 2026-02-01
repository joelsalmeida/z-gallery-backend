import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { buildGetPhotoThumbnailsFixture } from './__test__/get-photo-thumbnails.fixtures';
import { buildGetPhotoThumbnailsHarness } from './__test__/get-photo-thumbnails.harness';

describe('GetPhotoThumbnailsHandler – execute', () => {
  let harness: ReturnType<typeof buildGetPhotoThumbnailsHarness>;
  let fixture: ReturnType<typeof buildGetPhotoThumbnailsFixture>;

  beforeEach(() => {
    harness = buildGetPhotoThumbnailsHarness();
    fixture = buildGetPhotoThumbnailsFixture();
  });

  it('delegates to photoRepository.findThumbnailsByAlbum with restored ids', async () => {
    harness.photoRepository.findThumbnailsByAlbum.mockResolvedValueOnce(
      fixture.thumbnails,
    );

    await harness.handler.execute(fixture.query);

    expect(harness.photoRepository.findThumbnailsByAlbum).toHaveBeenCalledWith(
      AlbumId.restore(fixture.query.albumId),
      UserId.restore(fixture.query.userId),
    );
  });

  it('returns the thumbnails returned by the repository', async () => {
    harness.photoRepository.findThumbnailsByAlbum.mockResolvedValueOnce(
      fixture.thumbnails,
    );

    const result = await harness.handler.execute(fixture.query);

    expect(result).toBe(fixture.thumbnails);
  });

  it('propagates repository errors', async () => {
    const REPOSITORY_ERROR = new Error('Repository failure');

    harness.photoRepository.findThumbnailsByAlbum.mockRejectedValueOnce(
      REPOSITORY_ERROR,
    );

    const act = () => harness.handler.execute(fixture.query);

    await expect(act).rejects.toThrow(REPOSITORY_ERROR);
  });
});
