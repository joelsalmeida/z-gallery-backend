import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/http/controller/guards';
import { JwtPayload } from 'src/modules/auth/infrastructure/security/strategies/index.types';
import { FindUserByEmailUseCase } from '../../../application/use-cases';
import { UserResponse } from './dtos/responses.types';

type AuthenticationRequest = Request & { user: JwtPayload };

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly findByEmailService: FindUserByEmailUseCase) {}

  @Get('me')
  async findByEmail(
    @Request() req: AuthenticationRequest,
  ): Promise<UserResponse | null> {
    const user = await this.findByEmailService.execute({
      email: req.user.email,
    });

    if (!user) return null;

    return { id: user.id.toValue(), email: user.email.toValue() };
  }
}
