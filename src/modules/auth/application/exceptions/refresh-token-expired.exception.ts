import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from 'src/modules/shared/exceptions';

const MESSAGE = 'The provided token has expired.';
const HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
const CODE = 'REFRESH_TOKEN.EXPIRED';

export class RefreshTokenExpiredException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
