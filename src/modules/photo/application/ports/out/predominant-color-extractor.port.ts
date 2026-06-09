import { Color } from '@/modules/photo/domain/value-objects';

export abstract class PredominantColorExtractorPort {
  /**
   * Expects a valid image buffer.
   */
  abstract extract(buffer: Buffer): Promise<Color>;
}
