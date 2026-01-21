// TODO: Organize these files.
import { JwtPayload } from '../../infrastructure/security/strategies/index.types';

export type AuthenticationData = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
  };
};

export type RefreshTokenData = { accessToken: string; refreshToken: string };

export type JwtRequestContext = Request & { user: JwtPayload };
