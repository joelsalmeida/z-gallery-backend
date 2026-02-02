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

export class PhotoThumbnailDto {
  @ApiProperty({
    example: 'https://api.myapp.com/photos/thumbnails/abc123.jpg',
    description: 'Public URL for the photo thumbnail',
  })
  thumbnailUrl: string;
}

export class PhotoTableRowDto {
  @ApiProperty({
    example: 'a3f1e2b4-8c9d-4a1b-9c22-1f3d9b2a7e01',
  })
  id: string;

  @ApiProperty({
    example: 'Vacation in Rome',
  })
  title: string;

  @ApiProperty({
    example: 345678,
    description: 'File size in bytes',
  })
  size: number;

  @ApiProperty({
    example: '#A3B18A',
    description: 'Predominant color extracted from the image',
  })
  predominantColor: string;

  @ApiProperty({
    example: '2024-11-10T12:34:56.000Z',
  })
  creationDate: Date;

  @ApiProperty({
    example: '2024-11-11T09:20:00.000Z',
  })
  uploadDate: Date;
}

export class PhotoDetailsDto {
  @ApiProperty({ example: 'photo-uuid' })
  id: string;

  @ApiProperty({ example: 'album-uuid' })
  albumId: string;

  @ApiProperty({ example: 'Vacation photo' })
  title: string;

  @ApiProperty({ example: 'Sunset at the beach' })
  description: string;

  @ApiProperty({ example: 245678 })
  size: number;

  @ApiProperty({ example: '#AABBCC' })
  predominantColor: string;

  @ApiProperty({ example: '2025-01-20T10:30:00.000Z' })
  creationDate: Date;

  @ApiProperty({ example: '2025-01-25T18:42:10.000Z' })
  uploadDate: Date;
}
