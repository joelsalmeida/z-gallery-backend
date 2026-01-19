import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashedPassword } from 'src/modules/user/domain/value-objects';
import { PasswordHasherPort } from '../../application/ports/out';
import { Password } from '../../domain/value-objects';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
  async hash(password: Password): Promise<HashedPassword> {
    const SALT_ROUNDS = 10;
    const SALT = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password.exposeValue(), SALT);
    return HashedPassword.fromHash(passwordHash);
  }

  async matches(
    plainTextPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, passwordHash);
  }
}
