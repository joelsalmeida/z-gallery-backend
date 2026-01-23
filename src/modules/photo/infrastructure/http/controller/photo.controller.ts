import { GetAuthUserId } from '@/modules/auth/infrastructure/http/controller/decorators';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/http/controller/guards';
import {
  GetPhotoFile,
  GetPhotoFileQuery,
} from '@/modules/photo/application/queries/get-photo-file';
import {
  DeletePhotoUseCase,
  UploadPhotoUseCase,
} from '@/modules/photo/application/use-cases';
import {
  DeletePhotoCommand,
  UploadPhotoCommand,
} from '@/modules/photo/application/use-cases/commands';
import { PhotoFile } from '@/modules/photo/domain/value-objects';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadPhotoInput, UploadPhotoResponseDto } from './dtos';

@ApiTags('photos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller()
export class PhotoController {
  constructor(
    private readonly uploadPhotoService: UploadPhotoUseCase,
    private readonly deletePhotoService: DeletePhotoUseCase,
    private readonly getPhotoFileHandler: GetPhotoFile,
  ) {}

  // =========================
  // Upload photo
  // =========================
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: UploadPhotoResponseDto })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadPhotoInput,
    @GetAuthUserId() ownerId: string,
  ): Promise<UploadPhotoResponseDto> {
    if (!file) throw new BadRequestException('No file uploaded');

    const photoFile = PhotoFile.create(
      file.buffer,
      file.mimetype,
      file.originalname,
    );

    const command = new UploadPhotoCommand(
      photoFile,
      body.albumId,
      ownerId,
      body.title,
      body.description,
    );

    const photo = await this.uploadPhotoService.execute(command);

    return {
      id: photo.id.toValue(),
      albumId: photo.albumId.toValue(),
      title: photo.title.toValue(),
      description: photo.description.toValue(),
      size: photo.size.toValue(),
      predominantColor: photo.predominantColor.toValue(),
      location: photo.location.toValue(),
      creationDate: photo.creationDate.toValue(),
    };
  }

  // =========================
  // Get photo file (stream)
  // =========================
  @Get(':photoId')
  @ApiOkResponse({
    description: 'Returns the photo file as a stream',
  })
  async getById(
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<StreamableFile> {
    const query = new GetPhotoFileQuery(photoId, ownerId);
    const stream = await this.getPhotoFileHandler.execute(query);

    return new StreamableFile(stream.stream, {
      type: stream.contentType,
      length: stream.size,
    });
  }

  // =========================
  // Delete photo
  // =========================
  @Delete(':photoId')
  @ApiNoContentResponse({
    description: 'Photo deleted successfully',
  })
  async delete(
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<void> {
    const command = new DeletePhotoCommand(photoId, ownerId);
    await this.deletePhotoService.execute(command);
  }
}
