import { randomUUID } from 'crypto';

export class PhotoId {
  private constructor(private readonly _value: string) {}

  static generate(): PhotoId {
    return new PhotoId(randomUUID());
  }

  static restore(value: string): PhotoId {
    return new PhotoId(value);
  }

  toValue(): string {
    return this._value;
  }
}
