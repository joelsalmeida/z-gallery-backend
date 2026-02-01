export class ThumbnailLocation {
  private constructor(private readonly _value: string) {}

  static create(value: string): ThumbnailLocation {
    return new ThumbnailLocation(value);
  }

  static restore(value: string) {
    return new ThumbnailLocation(value);
  }

  toValue(): string {
    return this._value;
  }
}
