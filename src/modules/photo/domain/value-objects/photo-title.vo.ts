export class PhotoTitle {
  private constructor(private readonly _value: string) {}

  static create(value: string): PhotoTitle {
    return new PhotoTitle(value.trim());
  }

  static restore(value: string) {
    return new PhotoTitle(value);
  }

  toValue(): string {
    return this._value;
  }
}
