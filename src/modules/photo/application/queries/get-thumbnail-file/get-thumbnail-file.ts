import { GetThumbnailFileQuery } from '.';
import { ThumbnailFileStream } from '../../ports/out';

export abstract class GetThumbnailFile {
  abstract execute(
    command: GetThumbnailFileQuery,
  ): Promise<ThumbnailFileStream>;
}
