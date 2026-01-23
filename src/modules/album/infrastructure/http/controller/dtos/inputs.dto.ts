import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumInput {
  @ApiProperty({ example: 'My Vacation Album' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Photos from my 2025 vacation' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
