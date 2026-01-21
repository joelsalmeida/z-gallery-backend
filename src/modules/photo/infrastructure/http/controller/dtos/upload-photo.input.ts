import { PhotoFile } from '@/modules/photo/domain/value-objects';
import { IsNotEmpty } from 'class-validator';

export class UploadPhotoInput {
  @IsNotEmpty()
  file: PhotoFile;

  @IsNotEmpty()
  albumId: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}
