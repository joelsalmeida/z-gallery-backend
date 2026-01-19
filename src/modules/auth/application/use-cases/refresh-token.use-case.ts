import { RefreshTokenData } from '../dtos/authentication-data.dto';
import { RefreshTokenCommand } from './commands';

export abstract class RefreshTokenUserUseCase {
  abstract execute(command: RefreshTokenCommand): Promise<RefreshTokenData>;
}
