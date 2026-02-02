import {
  ThumbnailFileStream,
  ThumbnailStoragePort,
} from '@/modules/photo/application/ports/out';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThumbnailLocation } from '../../domain/value-objects';
import { LocalFileStorage } from './local-storage';

@Injectable()
export class LocalThumbnailStorage
  extends LocalFileStorage
  implements ThumbnailStoragePort
{
  private readonly FOLDER: string;
  private readonly EXTENSION = '.jpg';

  constructor(configService: ConfigService) {
    super(configService);
    this.FOLDER = configService.getOrThrow('storage.thumbnailsSubfolder');
  }

  async store(buffer: Buffer): Promise<ThumbnailLocation> {
    const fileName = `${this.generateRandomFileName()}${this.EXTENSION}`;

    await this.storeFile(this.FOLDER, fileName, buffer);
    return ThumbnailLocation.create(fileName);
  }

  async read(location: ThumbnailLocation): Promise<ThumbnailFileStream> {
    const file = await this.readFile(this.FOLDER, location.toValue());
    return new ThumbnailFileStream(file.stream, file.contentType, file.size);
  }

  async delete(location: ThumbnailLocation): Promise<void> {
    await this.deleteFile(this.FOLDER, location.toValue());
  }
}
