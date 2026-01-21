import { JwtRequestContext } from '@/modules/auth/application/dtos/authentication-data.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the authenticated user's ID from the request.
 * Should be used in controllers instead of receiving userId from the client.
 */
export const GetAuthUserId = createParamDecorator(
  (_: never, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<JwtRequestContext>();
    return request.user.sub;
  },
);
