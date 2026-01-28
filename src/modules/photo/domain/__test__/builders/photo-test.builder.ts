import { AlbumId } from '@/modules/album/domain/value-objects';
import { Photo } from '../../photo';
import {
  Color,
  FileSize,
  PhotoCreationDate,
  PhotoDescription,
  PhotoId,
  PhotoLocation,
  PhotoTitle,
} from '../../value-objects';

export class PhotoTestBuilder {
  private id = PhotoId.restore('e3b8d6b3-3d8a-4e88-8f77-123456789abc');
  private albumId = AlbumId.restore('a3b8d6b3-3d8a-4e88-8f77-abcdefabcdef');
  private title = PhotoTitle.create('Test photo');
  private description = PhotoDescription.create('Test description');
  private size = FileSize.fromBytes(1024);
  private color = Color.fromHex('#777777');
  private location = PhotoLocation.create('photos/test.jpg');
  private creationDate = PhotoCreationDate.fromDate(
    new Date('2024-01-01T00:00:00Z'),
  );

  withId(id: string): this {
    this.id = PhotoId.restore(id);
    return this;
  }

  withAlbumId(albumId: string): this {
    this.albumId = AlbumId.restore(albumId);
    return this;
  }

  withLocation(location: string): this {
    this.location = PhotoLocation.create(location);
    return this;
  }

  build(): Photo {
    return Photo.restore(
      this.id,
      this.albumId,
      this.title,
      this.description,
      this.size,
      this.color,
      this.location,
      this.creationDate,
    );
  }
}
