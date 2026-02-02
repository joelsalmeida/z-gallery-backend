import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fsSync from 'fs';
import { promises as fs } from 'fs';
import { lookup as lookupMime } from 'mime-types';
import * as path from 'path';
import { Readable } from 'stream';

class ReadableFile {
  constructor(
    public readonly stream: Readable,
    public readonly contentType: string,
    public readonly size: number,
  ) {}
}

@Injectable()
export abstract class LocalFileStorage {
  protected readonly storagePath: string;
  protected readonly OCTET_TYPE = 'application/octet-stream';

  constructor(configService: ConfigService) {
    this.storagePath = configService.getOrThrow('storage.path');
  }

  protected async storeFile(
    folder: string,
    fileName: string,
    buffer: Buffer,
  ): Promise<void> {
    const fullFolderPath = this.getFullFolderPath(folder);
    const fullFilePath = this.getFullFilePath(folder, fileName);

    await fs.mkdir(fullFolderPath, { recursive: true });
    await fs.writeFile(fullFilePath, buffer);
  }

  protected async readFile(
    folder: string,
    fileName: string,
  ): Promise<ReadableFile> {
    const fullFilePath = this.getFullFilePath(folder, fileName);

    const stats = await fs.stat(fullFilePath);
    const contentType = lookupMime(fullFilePath) || this.OCTET_TYPE;
    const readStream = fsSync.createReadStream(fullFilePath);

    return new ReadableFile(readStream, contentType, stats.size);
  }

  protected async deleteFile(folder: string, fileName: string): Promise<void> {
    const fullFilePath = this.getFullFilePath(folder, fileName);
    await fs.unlink(fullFilePath);
  }

  protected generateRandomFileName(): string {
    return crypto.randomUUID();
  }

  private getFullFolderPath(folder: string) {
    return path.join(this.storagePath, folder);
  }

  private getFullFilePath(folder: string, fileName: string) {
    return path.join(this.storagePath, folder, fileName);
  }
}
