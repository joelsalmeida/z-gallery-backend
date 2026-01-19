import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from 'src/modules/shared/exceptions';

type ErrorResponse = {
  code: string;
  message: string;
  timestamp: string;
  path: string;
};

@Catch(ApplicationException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const httpContext = host.switchToHttp();
    const response = httpContext.getResponse<Response<ErrorResponse>>();
    const request = httpContext.getRequest<Request>();

    // TODO: For security reasons, the client should not know exactly what happened.
    // Data returned is for development testing purposes only.
    const errorResponse: ErrorResponse = {
      code: exception.code,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(exception.httpStatus).json(errorResponse);
  }
}
