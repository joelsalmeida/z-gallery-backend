import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { GetAlbums } from '.';
import { AlbumViewRepository } from '../../ports/out';
import { AlbumView } from './album.view.type';
import { GetAlbumsQuery } from './get-albums.query';

@Injectable()
export class GetAlbumsHandler implements GetAlbums {
  constructor(private readonly albumRepository: AlbumViewRepository) {}

  execute(command: GetAlbumsQuery): Promise<AlbumView[]> {
    const ownerId = UserId.restore(command.ownerId);
    return this.albumRepository.findByOwner(ownerId);
  }
}
