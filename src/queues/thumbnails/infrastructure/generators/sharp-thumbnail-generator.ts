import { PhotoFileStream } from '@/modules/photo/application/ports/out/photo-storage.port';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { Readable } from 'stream';
import { ThumbnailGeneratorPort } from '../../ports/thumbnail-generator.port';

@Injectable()
export class SharpThumbnailGenerator implements ThumbnailGeneratorPort {
  async generate(input: PhotoFileStream): Promise<Buffer> {
    const photoBuffer = await this.streamToBuffer(input.stream);

    return sharp(photoBuffer)
      .resize(320, 320, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  private streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on('data', (chunk) => chunks.push(chunk as Buffer));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
