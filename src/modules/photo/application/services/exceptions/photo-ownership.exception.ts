import { ApplicationException } from '@/modules/shared/exceptions';
import { HttpStatus } from '@nestjs/common';

const MESSAGE = 'You do not have permission to access this photo.';
const HTTP_STATUS_CODE = HttpStatus.FORBIDDEN;
const CODE = 'PHOTO.OWNERSHIP.INVALID';

export class PhotoOwnershipException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
