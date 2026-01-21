export class AlbumTitle {
  private constructor(private readonly _value: string) {}

  static create(value: string): AlbumTitle {
    return new AlbumTitle(value.trim());
  }

  static restore(value: string): AlbumTitle {
    return new AlbumTitle(value);
  }

  toValue(): string {
    return this._value;
  }
}
