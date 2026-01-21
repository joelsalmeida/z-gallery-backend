import { PhotoStoragePort } from '@/modules/photo/application/ports/out';
import { PhotoFile, PhotoLocation } from '@/modules/photo/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class LocalPhotoStorage implements PhotoStoragePort {
  private readonly basePath: string;

  constructor(readonly configService: ConfigService) {
    this.basePath = configService.getOrThrow('storage.path');
  }

  async store(photoId: string, file: PhotoFile): Promise<PhotoLocation> {
    const extension = this.getExtension(file.mimeType, file.fileName);
    const fileName = `${photoId}${extension}`;
    const fullPath = path.join(this.basePath, fileName);

    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    return PhotoLocation.create(fileName);
  }

  async delete(location: PhotoLocation): Promise<void> {
    const fullPath = path.join(this.basePath, location.toValue());
    await fs.unlink(fullPath);
  }

  private getExtension(mimeType: string, fileName: string): string {
    const extFromName = path.extname(fileName);
    if (extFromName) return extFromName;
    return mimeType === 'image/png' ? '.png' : '.jpg';
  }
}
