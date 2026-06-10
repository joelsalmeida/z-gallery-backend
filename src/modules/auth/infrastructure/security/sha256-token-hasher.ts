import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { TokenHasherPort } from '../../application/ports/out';

@Injectable()
export class Sha256TokenHasher implements TokenHasherPort {
  hash(token: string): Promise<string> {
    return Promise.resolve(createHash('sha256').update(token).digest('hex'));
  }
}
