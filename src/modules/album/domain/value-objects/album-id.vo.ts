import { randomUUID } from 'crypto';

export class AlbumId {
  private constructor(private readonly _value: string) {}

  static generate(): AlbumId {
    return new AlbumId(randomUUID());
  }

  static restore(value: string): AlbumId {
    return new AlbumId(value);
  }

  toValue(): string {
    return this._value;
  }
}
