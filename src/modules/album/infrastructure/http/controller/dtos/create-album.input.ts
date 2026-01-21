import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlbumInput {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
