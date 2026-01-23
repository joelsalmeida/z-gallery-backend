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
