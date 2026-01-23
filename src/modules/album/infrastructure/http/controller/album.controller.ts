import { GetAuthUserId } from '@/modules/auth/infrastructure/http/controller/decorators';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/http/controller/guards';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CreateAlbumUseCase,
  DeleteAlbumUseCase,
} from '../../../application/use-cases';
import {
  CreateAlbumCommand,
  DeleteAlbumCommand,
} from '../../../application/use-cases/commands';
import { CreateAlbumInput, CreateAlbumResponseDto } from './dtos';

@ApiTags('albums')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class AlbumController {
  constructor(
    private readonly createAlbumService: CreateAlbumUseCase,
    private readonly deleteAlbumService: DeleteAlbumUseCase,
  ) {}

  // =========================
  // Create album
  // =========================
  @Post()
  @ApiCreatedResponse({ type: CreateAlbumResponseDto })
  async create(
    @Body() input: CreateAlbumInput,
    @GetAuthUserId() ownerId: string,
  ): Promise<CreateAlbumResponseDto> {
    const album = await this.createAlbumService.execute(
      new CreateAlbumCommand(ownerId, input.title, input.description),
    );

    return {
      id: album.id.toValue(),
      title: album.title.toValue(),
      description: album.description.toValue(),
      ownerId: album.ownerId.toValue(),
    };
  }

  // =========================
  // Delete album
  // =========================
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Album deleted successfully',
  })
  async delete(
    @Param('id') albumId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<void> {
    await this.deleteAlbumService.execute(
      new DeleteAlbumCommand(albumId, ownerId),
    );
  }
}
