import { PhotoStoragePort } from '@/modules/photo/application/ports/out';
import { PhotoFileStream } from '@/modules/photo/application/ports/out/photo-storage.port';
import { PhotoFile, PhotoLocation } from '@/modules/photo/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fsSync from 'fs';
import { promises as fs } from 'fs';
import { lookup as lookupMime } from 'mime-types';
import * as path from 'path';

@Injectable()
export class LocalPhotoStorage implements PhotoStoragePort {
  private readonly basePath: string;
  private readonly OCTET_TYPE = 'application/octet-stream';

  constructor(readonly configService: ConfigService) {
    this.basePath = configService.getOrThrow('storage.path');
  }

  async store(file: PhotoFile): Promise<PhotoLocation> {
    const extension = this.getExtension(file.mimeType, file.fileName);
    const fileName = `${this.generateRandomFileName()}${extension}`;
    const fullPath = path.join(this.basePath, fileName);

    await fs.mkdir(this.basePath, { recursive: true });
    await fs.writeFile(fullPath, file.buffer);

    return PhotoLocation.create(fileName);
  }

  async read(location: PhotoLocation): Promise<PhotoFileStream> {
    const fullPath = this.getFullPath(location);

    const stat = await fs.stat(fullPath);
    const contentType = lookupMime(fullPath) || this.OCTET_TYPE;
    const stream = fsSync.createReadStream(fullPath);

    return new PhotoFileStream(stream, contentType, stat.size);
  }

  async delete(location: PhotoLocation): Promise<void> {
    const fullPath = this.getFullPath(location);
    await fs.unlink(fullPath);
  }

  private getFullPath(location: PhotoLocation) {
    return path.join(this.basePath, location.toValue());
  }

  private getExtension(mimeType: string, fileName: string): string {
    const extFromName = path.extname(fileName);
    if (extFromName) return extFromName;
    return mimeType === 'image/png' ? '.png' : '.jpg';
  }

  private generateRandomFileName() {
    return crypto.randomUUID();
  }
}
