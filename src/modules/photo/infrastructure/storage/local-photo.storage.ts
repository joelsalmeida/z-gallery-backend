import { PhotoStoragePort } from '@/modules/photo/application/ports/out';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { PhotoFileStream } from '../../application/ports/out/photo-storage.port';
import { PhotoFile, PhotoLocation } from '../../domain/value-objects';
import { LocalFileStorage } from './local-storage';

@Injectable()
export class LocalPhotoStorage
  extends LocalFileStorage
  implements PhotoStoragePort
{
  private readonly FOLDER: string;

  constructor(configService: ConfigService) {
    super(configService);
    this.FOLDER = configService.getOrThrow('storage.photosSubfolder');
  }

  async store(file: PhotoFile): Promise<PhotoLocation> {
    const extension = this.getExtension(file.mimeType, file.fileName);
    const fileName = `${this.generateRandomFileName()}${extension}`;

    await this.storeFile(this.FOLDER, fileName, file.buffer);
    return PhotoLocation.create(fileName);
  }

  async read(location: PhotoLocation): Promise<PhotoFileStream> {
    const file = await this.readFile(this.FOLDER, location.toValue());
    return new PhotoFileStream(file.stream, file.contentType, file.size);
  }

  async delete(location: PhotoLocation): Promise<void> {
    await this.deleteFile(this.FOLDER, location.toValue());
  }

  private getExtension(mimeType: string, fileName: string): string {
    const extension = path.extname(fileName);
    if (extension) return extension;
    return mimeType === 'image/png' ? '.png' : '.jpg';
  }
}
