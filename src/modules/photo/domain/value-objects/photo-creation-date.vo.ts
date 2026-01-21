/**
 * Represents the date and time when the photo was originally created
 * (i.e. when the image was captured or generated).
 *
 * ⚠️ This is NOT the date when the photo was uploaded or persisted in the database.
 *
 * This value may come from:
 * - EXIF metadata (preferred)
 * - Client-provided acquisition date
 * - Fallback to current time when metadata is unavailable
 */
export class PhotoCreationDate {
  private constructor(private readonly _value: Date) {}

  static fromNow(): PhotoCreationDate {
    return new PhotoCreationDate(new Date());
  }

  static fromDate(date: Date): PhotoCreationDate {
    return new PhotoCreationDate(date);
  }

  static restore(date: Date) {
    return new PhotoCreationDate(date);
  }

  toValue(): Date {
    return this._value;
  }
}
