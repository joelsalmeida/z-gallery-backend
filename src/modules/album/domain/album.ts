import { UserId } from '../../user/domain/value-objects';
import { AlbumDescription, AlbumId, AlbumTitle } from './value-objects';

export class Album {
  private constructor(
    public readonly id: AlbumId,
    public readonly ownerId: UserId,
    private _title: AlbumTitle,
    private _description: AlbumDescription,
  ) {}

  get title(): AlbumTitle {
    return this._title;
  }

  get description(): AlbumDescription {
    return this._description;
  }

  changeTitle(title: AlbumTitle): void {
    this._title = title;
  }

  changeDescription(description: AlbumDescription): void {
    this._description = description;
  }

  isOwnedBy(id: UserId): boolean {
    return this.ownerId.toValue() === id.toValue();
  }

  static create(
    ownerId: UserId,
    title: AlbumTitle,
    description: AlbumDescription,
  ): Album {
    return new Album(AlbumId.generate(), ownerId, title, description);
  }

  static restore(
    id: AlbumId,
    ownerId: UserId,
    title: AlbumTitle,
    description: AlbumDescription,
  ): Album {
    return new Album(id, ownerId, title, description);
  }
}
