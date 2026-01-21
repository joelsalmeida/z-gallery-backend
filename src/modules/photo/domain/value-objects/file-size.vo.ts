export class FileSize {
  private constructor(private readonly _value: number) {}

  static fromBytes(bytes: number): FileSize {
    return new FileSize(bytes);
  }

  static restore(value: number) {
    return new FileSize(value);
  }

  toValue(): number {
    return this._value;
  }
}
