import { GetAlbumsQuery } from '.';
import { AlbumView } from './album.view.type';

export abstract class GetAlbums {
  abstract execute(query: GetAlbumsQuery): Promise<AlbumView[]>;
}
