import { HashedPassword } from 'src/modules/user/domain/value-objects';
import { Password } from '../../../domain/value-objects';

export abstract class PasswordHasherPort {
  abstract hash(password: Password): Promise<HashedPassword>;

  abstract matches(
    plainTextPassword: string,
    passwordHash: string,
  ): Promise<boolean>;
}
