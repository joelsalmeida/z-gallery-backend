import { ApplicationException } from '@/modules/shared/exceptions';
import { HttpStatus } from '@nestjs/common';

const MESSAGE = 'Album not found.';
const HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
const CODE = 'ALBUM.NOT_FOUND';

export class AlbumNotFoundException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
