import { appConfig } from '@/config/app-config';
import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { CookieOptions } from 'express';
import { Response } from 'express';
import ms from 'ms';
import { RefreshTokenUserUseCase } from 'src/modules/auth/application/use-cases/refresh-token.use-case';
import {
  AuthenticateUserUseCase,
  LogOutUseCase,
  RegisterUserUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
} from '../../../application/use-cases';
import { RefreshToken } from './decorators/refresh-token.decorator';
import {
  AuthenticateUserInput,
  AuthenticationResponseDto,
  RefreshTokenResponseDto,
  RegisterUserInput,
} from './dtos';
import {
  RequestPasswordResetInput,
  ResetPasswordInput,
} from './dtos/inputs.dto';
import { HEADERS } from './dtos/responses.dto';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

const SEVEN_DAYS = ms('7d');
const IN_PRODUCTION_ENVIRONMENT = appConfig().environment === 'production';

const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: IN_PRODUCTION_ENVIRONMENT,
  path: '/',
  maxAge: SEVEN_DAYS,
};

const ACCESS_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: IN_PRODUCTION_ENVIRONMENT,
  path: '/',
};

@ApiTags('auth')
@UseFilters(AuthExceptionFilter)
@Controller()
export class AuthController {
  constructor(
    private readonly registerUserService: RegisterUserUseCase,
    private readonly authenticateUserService: AuthenticateUserUseCase,
    private readonly refreshTokenService: RefreshTokenUserUseCase,
    private readonly requestPasswordResetService: RequestPasswordResetUseCase,
    private readonly resetPasswordService: ResetPasswordUseCase,
    private readonly logoutService: LogOutUseCase,
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
      user: data.user,
    };
  }

  // =========================
  // Login
  // =========================
  @Post('login')
  @ApiOkResponse({
    headers: HEADERS.REFRESH_TOKEN,
    type: AuthenticationResponseDto,
  })
  async login(
    @Body() input: AuthenticateUserInput,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthenticationResponseDto> {
    const authData = await this.authenticateUserService.execute(input);

    this.setRefreshTokenCookie(response, authData.refreshToken);
    this.setAccessTokenCookie(response, authData.accessToken);

    return {
      access_token: authData.accessToken,
      user: authData.user,
    };
  }

  // =========================
  // Log out
  // =========================
  @Post('logout')
  async logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (refreshToken) {
      await this.logoutService.execute({ refreshToken });
    }

    this.clearAuthCookies(res);
  }

  // =========================
  // Refresh
  // =========================
  @Post('refresh')
  @ApiCookieAuth('refresh-cookie')
  @ApiOkResponse({
    description: 'Returns new access token and sets refresh cookie',
    headers: HEADERS.REFRESH_TOKEN,
    type: RefreshTokenResponseDto,
  })
  async refresh(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    if (!refreshToken) throw new UnauthorizedException();

    const data = await this.refreshTokenService.execute({
      refreshToken,
    });

    this.setRefreshTokenCookie(response, data.refreshToken);
    this.setAccessTokenCookie(response, data.accessToken);

    return {
      access_token: data.accessToken,
    };
  }

  // =========================
  // Forgot Password
  // =========================
  @Post('forgot-password')
  async forgotPassword(
    @Body() input: RequestPasswordResetInput,
  ): Promise<void> {
    await this.requestPasswordResetService.execute(input);
  }

  // =========================
  // Reset Password
  // =========================
  @Post('reset-password')
  async resetPassword(@Body() input: ResetPasswordInput): Promise<void> {
    await this.resetPasswordService.execute(input);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }

  private setAccessTokenCookie(res: Response, accessToken: string) {
    res.cookie('access_token', accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
  }

  private clearAuthCookies(res: Response) {
    res.clearCookie('refresh_token', REFRESH_TOKEN_COOKIE_OPTIONS);
    res.clearCookie('access_token', ACCESS_TOKEN_COOKIE_OPTIONS);
  }
}
