import { AuthenticatedRequest } from '@/modules/auth/application/dtos/authentication-data.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.cookies?.refresh_token;
  },
);
