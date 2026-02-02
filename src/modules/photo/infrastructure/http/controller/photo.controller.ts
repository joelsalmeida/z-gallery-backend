import { AlbumOwnershipGuard } from '@/modules/album/infrastructure/http/controller/guards';
import { GetAuthUserId } from '@/modules/auth/infrastructure/http/controller/decorators';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/http/controller/guards';
import {
  GetPhoto,
  GetPhotoQuery,
} from '@/modules/photo/application/queries/get-photo';
import {
  GetPhotoFile,
  GetPhotoFileQuery,
} from '@/modules/photo/application/queries/get-photo-file';
import {
  GetPhotoThumbnails,
  GetPhotoThumbnailsQuery,
} from '@/modules/photo/application/queries/get-photo-thumbnails';
import type { PhotoThumbnailView } from '@/modules/photo/application/queries/get-photo-thumbnails/photo-thumbnails.view.type';
import {
  GetPhotosTable,
  GetPhotosTableQuery,
} from '@/modules/photo/application/queries/get-photos-table';
import type { PhotoTableRowView } from '@/modules/photo/application/queries/get-photos-table/photo-table-row.view.type';
import { GetThumbnailFile } from '@/modules/photo/application/queries/get-thumbnail-file';
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
import {
  PhotoDetailsDto,
  PhotoTableRowDto,
  PhotoThumbnailDto,
} from './dtos/responses.dto';

@ApiTags('photos')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, AlbumOwnershipGuard)
@Controller()
export class PhotoController {
  constructor(
    private readonly uploadPhotoService: UploadPhotoUseCase,
    private readonly deletePhotoService: DeletePhotoUseCase,
    private readonly getPhotoFileHandler: GetPhotoFile,
    private readonly getThumbnailFileHandler: GetThumbnailFile,
    private readonly getPhotosTableHandler: GetPhotosTable,
    private readonly getPhotoThumbnailsHandler: GetPhotoThumbnails,
    private readonly getPhotoHandler: GetPhoto,
  ) {}

  // =========================
  // Upload photo
  // =========================
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ type: UploadPhotoResponseDto })
  async upload(
    @Param('albumId') albumId: string,
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
      albumId,
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
  // Table view (metadata only)
  // =========================
  @Get('table')
  @ApiOkResponse({ type: PhotoTableRowDto, isArray: true })
  async getTable(
    @Param('albumId') albumId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<PhotoTableRowView[]> {
    return this.getPhotosTableHandler.execute(
      new GetPhotosTableQuery(albumId, ownerId),
    );
  }

  // =========================
  // Thumbnail view (images only)
  // =========================
  @Get('thumbnails')
  @ApiOkResponse({ type: PhotoThumbnailDto, isArray: true })
  async getThumbnails(
    @Param('albumId') albumId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<PhotoThumbnailView[]> {
    return this.getPhotoThumbnailsHandler.execute(
      new GetPhotoThumbnailsQuery(albumId, ownerId),
    );
  }

  // =========================
  // Get photo details (metadata)
  // =========================
  @Get(':photoId')
  @ApiOkResponse({ type: PhotoDetailsDto })
  async getDetails(
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<PhotoDetailsDto> {
    const photo = await this.getPhotoHandler.execute(
      new GetPhotoQuery(albumId, photoId, ownerId),
    );

    return {
      id: photo.id,
      albumId: photo.albumId,
      title: photo.title,
      description: photo.description,
      size: photo.size,
      predominantColor: photo.predominantColor,
      creationDate: photo.creationDate,
      uploadDate: photo.uploadDate,
    };
  }

  // =========================
  // Get photo file (stream)
  // =========================
  @Get(':photoId/file')
  @ApiOkResponse({
    description: 'Returns the photo file as a stream',
  })
  async getById(
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<StreamableFile> {
    const query = new GetPhotoFileQuery(albumId, photoId, ownerId);
    const stream = await this.getPhotoFileHandler.execute(query);

    return new StreamableFile(stream.stream, {
      type: stream.contentType,
      length: stream.size,
    });
  }

  // =========================
  // Get thumbnail file (stream)
  // =========================
  @Get(':photoId/file/thumb')
  @ApiOkResponse({
    description: 'Returns the thumbnail file as a stream',
  })
  async getThumbById(
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<StreamableFile> {
    const query = new GetPhotoFileQuery(albumId, photoId, ownerId);
    const stream = await this.getThumbnailFileHandler.execute(query);

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
    @Param('albumId') albumId: string,
    @Param('photoId') photoId: string,
    @GetAuthUserId() ownerId: string,
  ): Promise<void> {
    const command = new DeletePhotoCommand(albumId, photoId, ownerId);
    await this.deletePhotoService.execute(command);
  }
}
