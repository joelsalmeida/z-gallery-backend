export class PhotoDescription {
  private constructor(private readonly _value: string) {}

  static create(value: string): PhotoDescription {
    return new PhotoDescription(value.trim());
  }

  static restore(value: string) {
    return new PhotoDescription(value);
  }

  toValue(): string {
    return this._value;
  }
}
