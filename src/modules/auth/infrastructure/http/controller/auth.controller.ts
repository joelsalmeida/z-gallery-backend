import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { RefreshTokenUserUseCase } from 'src/modules/auth/application/use-cases/refresh-token.use-case';
import {
  AuthenticateUserUseCase,
  RegisterUserUseCase,
} from '../../../application/use-cases';
import {
  AuthenticateUserInput,
  RefreshTokenInput,
  RegisterUserInput,
} from './dtos';
import type {
  AuthenticationResponse,
  RefreshTokenResponse,
} from './dtos/responses.types';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AuthController {
  constructor(
    private readonly registerUserService: RegisterUserUseCase,
    private readonly authenticateUserService: AuthenticateUserUseCase,
    private readonly refreshTokenService: RefreshTokenUserUseCase,
  ) {}

  @Post('register')
  async register(
    @Body()
    input: RegisterUserInput,
  ): Promise<AuthenticationResponse> {
    const data = await this.registerUserService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      user: data.user,
    };
  }

  @Post('login')
  async login(
    @Body()
    input: AuthenticateUserInput,
  ): Promise<AuthenticationResponse> {
    const data = await this.authenticateUserService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      user: data.user,
    };
  }

  @Post('refresh')
  async refresh(
    @Body()
    input: RefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    const data = await this.refreshTokenService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    };
  }
}
