import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterUserInput {
  @ApiProperty({ example: 'user@email.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'strong-password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class AuthenticateUserInput {
  @ApiProperty({ example: 'user@email.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'strong-password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class RefreshTokenInput {
  @ApiProperty({ example: 'jwt-refresh-token' })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
