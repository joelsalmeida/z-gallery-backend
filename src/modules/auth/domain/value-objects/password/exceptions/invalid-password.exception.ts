import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../../../../../shared/exceptions';

const MESSAGE = `Invalid password. It must be at least 12 characters long and include an uppercase letter, 
  a lowercase letter, a number, and a special character.`;

const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'PASSWORD.INVALID';

export class InvalidPasswordException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
