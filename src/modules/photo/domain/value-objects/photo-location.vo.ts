export class PhotoLocation {
  private constructor(private readonly _value: string) {}

  static create(value: string): PhotoLocation {
    return new PhotoLocation(value);
  }

  static restore(value: string) {
    return new PhotoLocation(value);
  }

  toValue(): string {
    return this._value;
  }
}
