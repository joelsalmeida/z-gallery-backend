import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

import { Color } from '@/modules/photo/domain/value-objects';
import { PredominantColorExtractorPort } from '../../application/ports/out/predominant-color-extractor.port';

// TODO: Generate tests.
@Injectable()
export class SharpPredominantColorExtractorAdapter implements PredominantColorExtractorPort {
  async extract(buffer: Buffer): Promise<Color> {
    const stats = await sharp(buffer).stats();

    const { r, g, b } = stats.dominant;

    const hexColor = [r, g, b]
      .map((channel) => this.channelToHex(channel))
      .join('');

    return Color.fromHex(hexColor);
  }

  private channelToHex(channel: number): string {
    return channel.toString(16).padStart(2, '0');
  }
}
