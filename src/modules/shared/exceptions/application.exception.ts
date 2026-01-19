import { HttpStatus } from '@nestjs/common';

export abstract class ApplicationException extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: HttpStatus;

  protected constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
