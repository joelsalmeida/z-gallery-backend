import { ApplicationException } from '@/modules/shared/exceptions';
import { HttpStatus } from '@nestjs/common';

const MESSAGE = 'Photo not found.';
const HTTP_STATUS_CODE = HttpStatus.NOT_FOUND;
const CODE = 'PHOTO.NOT_FOUND';

export class PhotoNotFoundException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
