import { GetPhotosTableQuery } from '.';
import { PhotoTableRowView } from './photo-table-row.view.type';

export abstract class GetPhotosTable {
  abstract execute(query: GetPhotosTableQuery): Promise<PhotoTableRowView[]>;
}
