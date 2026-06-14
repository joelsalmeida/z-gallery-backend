import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from '../../config/app-config';
import { UserRepository } from '../user/application/ports/out';
import { PrismaUserRepository } from '../user/infrastructure/persistence';
import {
  EmailSenderPort,
  PasswordHasherPort,
  PasswordResetTokenRepository,
  TokenHasherPort,
  TokenIssuerPort,
} from './application/ports/out';
import { RefreshTokenRepository } from './application/ports/out/refresh-token.repository';
import {
  AuthenticateUserService,
  RefreshTokenService,
  RegisterUserService,
} from './application/services';
import { LogoutService } from './application/services/logout.service';
import { RequestPasswordResetService } from './application/services/request-reset-password.service';
import { ResetPasswordService } from './application/services/reset-password.service';
import {
  AuthenticateUserUseCase,
  LogoutUseCase,
  RegisterUserUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
} from './application/use-cases';
import { RefreshTokenUserUseCase } from './application/use-cases/refresh-token.use-case';
import { ConsoleEmailSender } from './infrastructure/email/console-email-sender';
import { AuthController } from './infrastructure/http/controller/auth.controller';
import { PrismaPasswordResetTokenRepository } from './infrastructure/persistence/prisma-password-reset-token.repository';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma-refresh-token.repository';
import {
  BcryptPasswordHasher,
  JwtTokenIssuer,
  Sha256TokenHasher,
} from './infrastructure/security';
import {
  JwtAuthStrategy,
  LocalAuthStrategy,
} from './infrastructure/security/strategies';

export const AuthProviders: Provider[] = [
  // USE CASES
  { provide: AuthenticateUserUseCase, useClass: AuthenticateUserService },
  {
    provide: LogoutUseCase,
    useClass: LogoutService,
  },
  { provide: RegisterUserUseCase, useClass: RegisterUserService },
  { provide: RefreshTokenUserUseCase, useClass: RefreshTokenService },
  {
    provide: RequestPasswordResetUseCase,
    useClass: RequestPasswordResetService,
  },
  { provide: ResetPasswordUseCase, useClass: ResetPasswordService },

  // REPOSITORIES
  { provide: UserRepository, useClass: PrismaUserRepository },
  { provide: RefreshTokenRepository, useClass: PrismaRefreshTokenRepository },
  {
    provide: PasswordResetTokenRepository,
    useClass: PrismaPasswordResetTokenRepository,
  },

  // PORTS
  { provide: PasswordHasherPort, useClass: BcryptPasswordHasher },
  {
    provide: TokenHasherPort,
    useClass: Sha256TokenHasher,
  },
  { provide: TokenIssuerPort, useClass: JwtTokenIssuer },
  { provide: EmailSenderPort, useClass: ConsoleEmailSender },
];

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        global: true,
        secret: configService.get('jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: configService.get('jwt.accessExpiration', { infer: true }),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [...AuthProviders, LocalAuthStrategy, JwtAuthStrategy],
  exports: [...AuthProviders],
})
export class AuthModule {}
