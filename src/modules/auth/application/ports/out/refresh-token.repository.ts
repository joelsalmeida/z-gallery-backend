import { RefreshToken } from '../../../domain/value-objects';

export abstract class RefreshTokenRepository {
  abstract save(refreshToken: RefreshToken): Promise<void>;

  abstract find(refreshToken: string): Promise<RefreshToken | null>;

  abstract delete(refreshToken: RefreshToken): Promise<void>;
}
