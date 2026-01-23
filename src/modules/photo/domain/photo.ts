import { AlbumId } from '../../album/domain/value-objects';
import {
  Color,
  FileSize,
  PhotoCreationDate,
  PhotoDescription,
  PhotoId,
  PhotoLocation,
  PhotoTitle,
} from './value-objects';

export class Photo {
  private constructor(
    public readonly id: PhotoId,
    public readonly albumId: AlbumId,
    private _title: PhotoTitle,
    private _description: PhotoDescription,
    public readonly size: FileSize,
    public readonly predominantColor: Color,
    private _location: PhotoLocation,
    public readonly creationDate: PhotoCreationDate,
  ) {}

  get title(): PhotoTitle {
    return this._title;
  }

  get description(): PhotoDescription {
    return this._description;
  }

  get location() {
    return this._location;
  }

  changeTitle(title: PhotoTitle) {
    this._title = title;
  }

  changeDescription(description: PhotoDescription) {
    this._description = description;
  }

  static create(
    albumId: AlbumId,
    title: PhotoTitle,
    description: PhotoDescription,
    size: FileSize,
    color: Color,
    location: PhotoLocation,
    //TODO: Allow a null value in cases where it is not possible
    // to identify the creation date of the original file.
    // "createdAt" already serves as the file upload date.
    creationDate: PhotoCreationDate,
  ) {
    return new Photo(
      PhotoId.generate(),
      albumId,
      title,
      description,
      size,
      color,
      location,
      creationDate,
    );
  }

  static restore(
    id: PhotoId,
    albumId: AlbumId,
    title: PhotoTitle,
    description: PhotoDescription,
    size: FileSize,
    color: Color,
    location: PhotoLocation,
    creationDate: PhotoCreationDate,
  ) {
    return new Photo(
      id,
      albumId,
      title,
      description,
      size,
      color,
      location,
      creationDate,
    );
  }
}
