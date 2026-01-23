import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadPhotoInput {
  @ApiProperty({ example: 'album-uuid' })
  @IsNotEmpty()
  @IsString()
  albumId: string;

  @ApiProperty({ example: 'Vacation photo' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Sunset at the beach' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
