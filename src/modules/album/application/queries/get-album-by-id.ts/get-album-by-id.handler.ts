import { AlbumId } from '@/modules/album/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { AlbumViewRepository } from '../../ports/out';
import { AlbumView } from './album.view.type';
import { GetAlbumById } from './get-album-by-id';
import { GetAlbumByIdQuery } from './get-album-by-id.query';

@Injectable()
export class GetAlbumByIdHandler implements GetAlbumById {
  constructor(private readonly albumRepository: AlbumViewRepository) {}

  execute(command: GetAlbumByIdQuery): Promise<AlbumView | null> {
    const ownerId = AlbumId.restore(command.id);
    return this.albumRepository.findById(ownerId);
  }
}
