import { GetAuthUserId } from '@/modules/auth/infrastructure/http/controller/decorators';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/http/controller/guards';
import {
  DeletePhotoCommand,
  UploadPhotoCommand,
} from '@/modules/photo/application/use-cases/commands';
import { DeletePhotoUseCase } from '@/modules/photo/application/use-cases/delete-photo.use-case';
import { UploadPhotoUseCase } from '@/modules/photo/application/use-cases/upload-photo.use-case';
import { PhotoFile } from '@/modules/photo/domain/value-objects';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadPhotoResponse } from './dtos/responses.types';

// TODO: Move this.
type UploadedFile = {
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
  path?: string;
};

@Controller()
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(
    private readonly uploadPhotoService: UploadPhotoUseCase,
    private readonly deletePhotoService: DeletePhotoUseCase,
  ) {}

  // TODO: Limit image sizes.
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: UploadedFile,
    @Body()
    body: {
      title: string;
      description: string;
      albumId: string;
      ownerId: string;
    },
    @GetAuthUserId() ownerId: string,
  ): Promise<UploadPhotoResponse> {
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

  @Delete(':photoId')
  async delete(
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<void> {
    const command = new DeletePhotoCommand(photoId, ownerId);
    await this.deletePhotoService.execute(command);
  }
}
