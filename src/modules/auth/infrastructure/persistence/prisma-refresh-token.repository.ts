import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/shared/prisma/prisma.service';
import { UserId } from 'src/modules/user/domain/value-objects';
import { RefreshTokenRepository } from '../../application/ports/out/refresh-token.repository';
import { RefreshToken } from '../../domain/value-objects';

@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(token: RefreshToken): Promise<void> {
    await this.prismaService.refreshToken.create({
      data: {
        token: token.toValue(),
        userId: token.userId.toValue(),
        expiresAt: token.expiresAt,
      },
    });
  }

  async find(token: string): Promise<RefreshToken | null> {
    const record = await this.prismaService.refreshToken.findUnique({
      where: { token },
    });

    if (!record) return null;

    return RefreshToken.restore(
      record.token,
      UserId.restore(record.userId),
      record.expiresAt,
    );
  }

  async delete(token: RefreshToken): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: {
        token: token.toValue(),
      },
    });
  }
}
