import { ApiProperty } from '@nestjs/swagger';

export class UploadPhotoResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'album-uuid' })
  albumId: string;

  @ApiProperty({ example: 'Vacation photo' })
  title: string;

  @ApiProperty({ example: 'Sunset at the beach' })
  description: string;

  @ApiProperty({ example: 245678 })
  size: number;

  @ApiProperty({ example: '#FFAA00' })
  predominantColor: string;

  @ApiProperty({ example: 'Rio de Janeiro, Brazil' })
  location: string;

  @ApiProperty({ example: '2026-01-01T12:00:00.000Z' })
  creationDate: Date;
}
