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
  RegisterUserUseCase,
} from '../../../application/use-cases';
import { RefreshToken } from './decorators/refresh-token.decorator';
import {
  AuthenticateUserInput,
  AuthenticationResponseDto,
  RefreshTokenResponseDto,
  RegisterUserInput,
} from './dtos';
import { HEADERS } from './dtos/responses.dto';
import { AuthExceptionFilter } from './filters/auth-exception.filter';

const SEVEN_DAYS = ms('7d');
const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  path: '/',
  maxAge: SEVEN_DAYS,
};

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

    return {
      access_token: authData.accessToken,
      user: authData.user,
    };
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

    return {
      access_token: data.accessToken,
    };
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }
}
