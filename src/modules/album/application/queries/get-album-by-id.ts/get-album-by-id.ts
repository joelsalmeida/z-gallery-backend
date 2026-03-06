import { AlbumView } from './album.view.type';
import { GetAlbumByIdQuery } from './get-album-by-id.query';

export abstract class GetAlbumById {
  abstract execute(query: GetAlbumByIdQuery): Promise<AlbumView | null>;
}
