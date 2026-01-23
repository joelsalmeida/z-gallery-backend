import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RefreshTokenUserUseCase } from 'src/modules/auth/application/use-cases/refresh-token.use-case';
import {
  AuthenticateUserUseCase,
  RegisterUserUseCase,
} from '../../../application/use-cases';
import {
  AuthenticateUserInput,
  AuthenticationResponseDto,
  RefreshTokenInput,
  RefreshTokenResponseDto,
  RegisterUserInput,
} from './dtos';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

@ApiTags('auth')
@UseFilters(AuthExceptionFilter)
@Controller()
export class AuthController {
  constructor(
    private readonly registerUserService: RegisterUserUseCase,
    private readonly authenticateUserService: AuthenticateUserUseCase,
    private readonly refreshTokenService: RefreshTokenUserUseCase,
  ) {}

  // =========================
  // Register
  // =========================
  @Post('register')
  @ApiOkResponse({ type: AuthenticationResponseDto })
  async register(
    @Body()
    input: RegisterUserInput,
  ): Promise<AuthenticationResponseDto> {
    const data = await this.registerUserService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      user: data.user,
    };
  }

  // =========================
  // Login
  // =========================
  @Post('login')
  @ApiOkResponse({ type: AuthenticationResponseDto })
  async login(
    @Body()
    input: AuthenticateUserInput,
  ): Promise<AuthenticationResponseDto> {
    const data = await this.authenticateUserService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      user: data.user,
    };
  }

  // =========================
  // Refresh
  // =========================
  @Post('refresh')
  @ApiOkResponse({ type: RefreshTokenResponseDto })
  async refresh(
    @Body()
    input: RefreshTokenInput,
  ): Promise<RefreshTokenResponseDto> {
    const data = await this.refreshTokenService.execute(input);

    return {
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
    };
  }
}
