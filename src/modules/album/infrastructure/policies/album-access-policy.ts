import {
  AlbumAccessPolicyPort,
  AlbumRepository,
} from '@/modules/album/application/ports/out';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { AlbumId } from '../../domain/value-objects';

@Injectable()
export class AlbumAccessPolicy implements AlbumAccessPolicyPort {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async canAccessAlbum(albumId: AlbumId, userId: UserId): Promise<boolean> {
    return this.albumRepository.isOwnedBy(albumId, userId);
  }
}
