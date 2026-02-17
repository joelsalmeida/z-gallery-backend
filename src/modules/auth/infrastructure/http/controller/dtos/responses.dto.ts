import { ApiProperty } from '@nestjs/swagger';

class AuthenticatedUserDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'user@email.com' })
  email: string;
}

export class AuthenticationResponseDto {
  @ApiProperty({ example: 'jwt-access-token' })
  access_token: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user: AuthenticatedUserDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'new-jwt-access-token' })
  access_token: string;
}

export const HEADERS = {
  REFRESH_TOKEN: {
    'Set-Cookie': {
      description: 'HTTP-only refresh token cookie',
      schema: {
        type: 'string',
        example:
          'refresh_token=Ab1.Cd2.Ef3; Path=/; HttpOnly; Secure; SameSite=Lax',
      },
    },
  },
};
