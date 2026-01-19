import { Injectable } from '@nestjs/common';
import { UserRepository } from '../ports/out';
import { FindUserByEmailUseCase } from '../use-cases';
import { FindUserByEmailCommand } from '../use-cases/commands';

@Injectable()
export class FindUserByEmailService implements FindUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(command: FindUserByEmailCommand) {
    return this.userRepository.findByEmail(command.email);
  }
}
