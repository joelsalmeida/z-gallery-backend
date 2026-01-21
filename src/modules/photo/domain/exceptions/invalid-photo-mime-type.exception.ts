import { DomainException } from '@/modules/shared/exceptions';
import { HttpStatus } from '@nestjs/common';

const MESSAGE = 'The photo file mime type provided is invalid.';
const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'PHOTO_FILE.MIME_TYPE.INVALID';

export class InvalidPhotoMimeTypeException extends DomainException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
