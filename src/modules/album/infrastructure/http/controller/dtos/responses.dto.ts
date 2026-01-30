import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumResponseDto {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'My Vacation Album' })
  title: string;

  @ApiProperty({ example: 'Photos from my 2025 vacation' })
  description: string;

  @ApiProperty({ example: 'owner-uuid' })
  ownerId: string;
}

export class GetAlbumsResponseDto {
  @ApiProperty({
    example: '46b8cdce-aaee-4b36-9723-9cad73a48bc8',
    description: 'Album unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'My Vacation',
    description: 'Album title',
  })
  title: string;

  @ApiProperty({
    example: 'Photos from my 2024 vacation',
    description: 'Album description',
  })
  description: string;

  @ApiProperty({
    example: 42,
    description: 'Number of photos in the album',
  })
  photoCount: number;

  @ApiProperty({
    example: '2025-01-10T14:32:00.000Z',
    description: 'Album creation date',
  })
  createdAt: Date;
}
