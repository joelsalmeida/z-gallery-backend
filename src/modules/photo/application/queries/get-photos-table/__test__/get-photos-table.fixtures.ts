import { GetPhotosTableQuery } from '../get-photos-table.query';
import { PhotoTableRowView } from '../photo-table-row.view.type';

export const buildGetPhotosTableFixture = () => {
  const query: GetPhotosTableQuery = {
    albumId: 'album-123',
    userId: 'user-123',
  };

  const rows: PhotoTableRowView[] = [
    {
      id: 'photo-1',
      title: 'Photo 1',
      size: 1024,
      predominantColor: '#FFF',
      creationDate: new Date('2024-01-01T10:00:00.000Z'),
      uploadDate: new Date('2024-01-02T10:00:00.000Z'),
    },
    {
      id: 'photo-2',
      title: 'Photo 2',
      size: 2048,
      predominantColor: '#000',
      creationDate: new Date('2024-02-01T10:00:00.000Z'),
      uploadDate: new Date('2024-02-02T10:00:00.000Z'),
    },
  ];

  return {
    query,
    rows,
  };
};
