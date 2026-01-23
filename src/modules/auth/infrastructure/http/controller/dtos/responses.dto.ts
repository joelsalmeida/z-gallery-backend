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

  @ApiProperty({ example: 'jwt-refresh-token' })
  refresh_token: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  user: AuthenticatedUserDto;
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 'new-jwt-access-token' })
  access_token: string;

  @ApiProperty({ example: 'new-jwt-refresh-token' })
  refresh_token: string;
}
