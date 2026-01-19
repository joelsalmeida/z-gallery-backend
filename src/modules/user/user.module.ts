import { Module, Provider } from '@nestjs/common';
import { UserRepository } from './application/ports/out';
import { FindUserByEmailService } from './application/services';
import { FindUserByEmailUseCase } from './application/use-cases';
import { UserController } from './infrastructure/http/controller/user.controller';
import { PrismaUserRepository } from './infrastructure/persistence';

export const UserProviders: Provider[] = [
  { provide: FindUserByEmailUseCase, useClass: FindUserByEmailService },
  { provide: UserRepository, useClass: PrismaUserRepository },
];

@Module({
  controllers: [UserController],
  providers: [...UserProviders],
  exports: [...UserProviders],
})
export class UserModule {}
