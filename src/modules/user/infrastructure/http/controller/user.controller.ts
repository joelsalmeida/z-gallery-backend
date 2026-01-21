import { JwtRequestContext } from '@/modules/auth/application/dtos/authentication-data.dto';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/http/controller/guards';
import { FindUserByEmailUseCase } from '../../../application/use-cases';
import { UserResponse } from './dtos/responses.types';

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly findByEmailService: FindUserByEmailUseCase) {}

  // Keep for testing purposes only.
  // Remove as soon as possible.
  @Get('me')
  async findMe(
    @Request() req: JwtRequestContext,
  ): Promise<UserResponse | null> {
    const user = await this.findByEmailService.execute({
      email: req.user.email,
    });

    if (!user) return null;

    return { id: user.id.toValue(), email: user.email.toValue() };
  }
}
