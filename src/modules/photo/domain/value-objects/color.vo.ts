export class Color {
  private constructor(private readonly _value: string) {}

  static fromHex(hex: string): Color {
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
      throw new Error('Invalid hex color');
    }

    return new Color(hex.startsWith('#') ? hex : `#${hex.toUpperCase()}`);
  }

  static restore(value: string) {
    return new Color(value);
  }

  toValue(): string {
    return this._value;
  }
}
