import { DomainException } from '@/modules/shared/exceptions';
import { HttpStatus } from '@nestjs/common';

const MESSAGE = 'The file name provided is invalid.';
const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'PHOTO_FILE.NAME.INVALID';

export class InvalidPhotoFileNameException extends DomainException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
