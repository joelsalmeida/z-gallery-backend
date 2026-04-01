export class RealtimeEventId {
  private constructor(private readonly value: string) {}

  static create(value: string): RealtimeEventId {
    // TODO: Add a custom exception.
    if (!value) throw new Error('EventName cannot be empty');

    return new RealtimeEventId(value.trim());
  }

  toValue(): string {
    return this.value;
  }

  equals(other: RealtimeEventId): boolean {
    return this.value === other.value;
  }
}
