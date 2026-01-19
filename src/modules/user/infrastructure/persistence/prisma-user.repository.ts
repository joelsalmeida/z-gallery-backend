import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/shared/prisma/prisma.service';
import { UserRepository } from '../../application/ports/out';
import { User } from '../../domain/user';
import { Email, HashedPassword, UserId } from '../../domain/value-objects';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: {
        id: user.id.toValue(),
        email: user.email.toValue(),
        password: user.password.toValue(),
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prismaService.user.findUnique({
      where: { id: id },
    });

    if (!record) return null;

    return User.restore(
      UserId.restore(record.id),
      Email.restore(record.email),
      HashedPassword.restore(record.password),
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    if (!record) return null;

    return User.restore(
      UserId.restore(record.id),
      Email.restore(record.email),
      HashedPassword.restore(record.password),
    );
  }
}
