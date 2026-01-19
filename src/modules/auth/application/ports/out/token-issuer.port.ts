import { User } from 'src/modules/user/domain/user';

type Tokens = { accessToken: string; refreshToken: string };

export abstract class TokenIssuerPort {
  abstract issue(user: User): Promise<Tokens>;

  abstract refresh(refreshToken: string): Promise<Tokens>;
}
