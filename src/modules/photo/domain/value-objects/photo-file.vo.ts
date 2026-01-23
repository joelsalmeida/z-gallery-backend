import {
  InvalidPhotoFileException,
  InvalidPhotoFileNameException,
  InvalidPhotoMimeTypeException,
} from '../exceptions';

export class PhotoFile {
  private constructor(
    public readonly buffer: Buffer,
    public readonly mimeType: string,
    public readonly fileName: string,
  ) {}

  static create(buffer: Buffer, mimeType: string, fileName: string): PhotoFile {
    const INVALID_BUFFER = !buffer || buffer.length === 0;
    const INVALID_FILE_NAME = !fileName.trim();
    const INVALID_MIME_TYPE = !mimeType.startsWith('image/');

    if (INVALID_BUFFER) throw new InvalidPhotoFileException();

    if (INVALID_MIME_TYPE) throw new InvalidPhotoMimeTypeException();

    if (INVALID_FILE_NAME) throw new InvalidPhotoFileNameException();

    return new PhotoFile(Buffer.from(buffer), mimeType, fileName.trim());
  }

  get size(): number {
    return this.buffer.length;
  }
}
