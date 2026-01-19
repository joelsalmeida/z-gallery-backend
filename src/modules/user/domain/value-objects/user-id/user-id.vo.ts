export class UserId {
  private readonly _value: string;

  private constructor(id: string) {
    this._value = id;
  }

  static generate(): UserId {
    return new UserId(this.generateId());
  }

  toValue(): string {
    return this._value;
  }

  /**
   * Restores a UserId from persistence.
   *
   * This method bypasses generation and validation and MUST only be used
   * when rehydrating domain entities from trusted storage where the identifier
   * was previously generated and validated by the domain.
   *
   * Using this method with arbitrary or user-provided input may result in
   * invalid UserId instances and should be avoided.
   */
  static restore(userId: string): UserId {
    return new UserId(userId);
  }

  equals(userId: UserId): boolean {
    return this._value === userId._value;
  }

  /**
   * Generates a user ID with the following format:
   * - Derived from a UUID
   * - Uses the first 16 hexadecimal characters
   * - Uppercase letters only
   * - Grouped into blocks of 4 characters separated by hyphens
   * - Example: 9F3A-7C2D-B81E-9A57
   */
  private static generateId(): string {
    return crypto
      .randomUUID()
      .replace(/-/g, '')
      .substring(0, 16)
      .toUpperCase()
      .match(/.{1,4}/g)!
      .join('-');
  }
}
