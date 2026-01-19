import { HttpStatus } from '@nestjs/common';
import { ApplicationException } from 'src/modules/shared/exceptions';

const MESSAGE = 'An account already exists using the provided email address.';
const HTTP_STATUS_CODE = HttpStatus.CONFLICT;
const CODE = 'USER.EMAIL.ALREADY_IN_USE';

// TODO: The creation of the codes should be more secure, avoiding duplication.
// Messages and codes can be inserted dynamically using the existing codes as a reference.
export class EmailAlreadyInUseException extends ApplicationException {
  readonly httpStatus: HttpStatus;
  readonly code: string;

  constructor() {
    super(MESSAGE);

    this.code = CODE;
    this.name = this.constructor.name;
    this.httpStatus = HTTP_STATUS_CODE;
  }
}
