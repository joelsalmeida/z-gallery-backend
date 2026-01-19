import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from '../../../../../shared/exceptions';

const MESSAGE = 'The provided refresh token is invalid or has expired.';

const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'REFRESH_TOKEN.INVALID';

export class InvalidRefreshTokenException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
