import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationData } from 'src/modules/auth/application/dtos';
import { AuthenticateUserUseCase } from 'src/modules/auth/application/use-cases';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticateUser: AuthenticateUserUseCase) {
    super();
  }

  async validate(email: string, password: string): Promise<AuthenticationData> {
    return this.authenticateUser.execute({ email, password });
  }
}
