import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from 'src/modules/shared/exceptions';

const MESSAGE = 'The token provided is invalid.';
const HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
const CODE = 'REFRESH_TOKEN.INVALID';

export class RefreshTokenInvalidException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
