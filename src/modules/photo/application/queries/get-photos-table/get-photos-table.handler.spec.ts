import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { buildGetPhotosTableFixture } from './__test__/get-photos-table.fixtures';
import { buildGetPhotosTableHarness } from './__test__/get-photos-table.harness';

describe('GetPhotosTableHandler – execute', () => {
  let harness: ReturnType<typeof buildGetPhotosTableHarness>;
  let fixture: ReturnType<typeof buildGetPhotosTableFixture>;

  beforeEach(() => {
    harness = buildGetPhotosTableHarness();
    fixture = buildGetPhotosTableFixture();
  });

  it('calls repository with restored albumId and userId', async () => {
    harness.photoRepository.findTableRowsByAlbum.mockResolvedValueOnce(
      fixture.rows,
    );

    await harness.handler.execute(fixture.query);

    expect(harness.photoRepository.findTableRowsByAlbum).toHaveBeenCalledWith(
      AlbumId.restore(fixture.query.albumId),
      UserId.restore(fixture.query.userId),
    );
  });

  it('returns the table rows from repository', async () => {
    harness.photoRepository.findTableRowsByAlbum.mockResolvedValueOnce(
      fixture.rows,
    );

    const result = await harness.handler.execute(fixture.query);

    expect(result).toEqual(fixture.rows);
  });

  it('propagates repository errors', async () => {
    const REPOSITORY_ERROR = new Error('Database unavailable');
    harness.photoRepository.findTableRowsByAlbum.mockRejectedValueOnce(
      REPOSITORY_ERROR,
    );

    const act = () => harness.handler.execute(fixture.query);

    await expect(act).rejects.toThrow(REPOSITORY_ERROR);
  });
});
