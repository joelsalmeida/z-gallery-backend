import { Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from '../../config/app-config';
import { UserRepository } from '../user/application/ports/out';
import { PrismaUserRepository } from '../user/infrastructure/persistence';
import { PasswordHasherPort, TokenIssuerPort } from './application/ports/out';
import { RefreshTokenRepository } from './application/ports/out/refresh-token.repository';
import {
  AuthenticateUserService,
  RefreshTokenService,
  RegisterUserService,
} from './application/services';
import {
  AuthenticateUserUseCase,
  RegisterUserUseCase,
} from './application/use-cases';
import { RefreshTokenUserUseCase } from './application/use-cases/refresh-token.use-case';
import { AuthController } from './infrastructure/http/controller/auth.controller';
import { PrismaRefreshTokenRepository } from './infrastructure/persistence/prisma-refresh-token.repository';
import {
  BcryptPasswordHasher,
  JwtTokenIssuer,
} from './infrastructure/security';
import {
  JwtAuthStrategy,
  LocalAuthStrategy,
} from './infrastructure/security/strategies';

export const AuthProviders: Provider[] = [
  { provide: AuthenticateUserUseCase, useClass: AuthenticateUserService },
  { provide: RegisterUserUseCase, useClass: RegisterUserService },
  { provide: RefreshTokenUserUseCase, useClass: RefreshTokenService },
  { provide: UserRepository, useClass: PrismaUserRepository },
  { provide: RefreshTokenRepository, useClass: PrismaRefreshTokenRepository },
  { provide: PasswordHasherPort, useClass: BcryptPasswordHasher },
  { provide: TokenIssuerPort, useClass: JwtTokenIssuer },
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
