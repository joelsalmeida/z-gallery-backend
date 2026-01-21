export class AlbumDescription {
  private constructor(private readonly _value: string) {}

  static create(value: string): AlbumDescription {
    return new AlbumDescription(value.trim());
  }

  static restore(value: string): AlbumDescription {
    return new AlbumDescription(value);
  }

  toValue(): string {
    return this._value;
  }
}
