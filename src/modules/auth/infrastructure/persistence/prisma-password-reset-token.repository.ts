import { PrismaService } from '@/modules/shared/prisma/prisma.service';
import { UserId } from '@/modules/user/domain/value-objects/user-id/user-id.vo';
import { Injectable } from '@nestjs/common';
import { PasswordResetTokenRepository } from '../../application/ports/out';
import { PasswordResetToken } from '../../domain/value-objects/password-reset-token/password-reset-token.vo';

@Injectable()
export class PrismaPasswordResetTokenRepository implements PasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(token: PasswordResetToken): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        token: token.toValue(),
        userId: token.userId.toValue(),
        expiresAt: token.expiresAt,
      },
    });
  }

  async update(token: PasswordResetToken): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { token: token.toValue() },
      data: {
        usedAt: token.usedAt,
      },
    });
  }

  async find(token: string): Promise<PasswordResetToken | null> {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!record) return null;

    return PasswordResetToken.restore(
      record.token,
      UserId.restore(record.userId),
      record.expiresAt,
      record.usedAt ? new Date(record.usedAt) : null,
    );
  }

  async delete(token: PasswordResetToken): Promise<void> {
    await this.prisma.passwordResetToken.delete({
      where: { token: token.toValue() },
    });
  }
}
