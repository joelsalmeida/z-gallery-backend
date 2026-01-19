import { HttpStatus } from '@nestjs/common';
import { DomainException } from '../../../../../shared/exceptions';

const MESSAGE = 'The email address provided is invalid.';
const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'EMAIL.INVALID';

export class InvalidEmailException extends DomainException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
