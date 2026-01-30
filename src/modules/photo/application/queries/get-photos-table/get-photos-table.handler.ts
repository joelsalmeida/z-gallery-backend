import { AlbumId } from '@/modules/album/domain/value-objects';
import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { GetPhotosTableQuery } from '.';
import { PhotoViewRepository } from '../../ports/out';
import { PhotoTableRowView } from './photo-table-row.view.type';

@Injectable()
export class GetPhotosTableHandler {
  constructor(private readonly photoRepository: PhotoViewRepository) {}

  execute(query: GetPhotosTableQuery): Promise<PhotoTableRowView[]> {
    return this.photoRepository.findTableRowsByAlbum(
      AlbumId.restore(query.albumId),
      UserId.restore(query.userId),
    );
  }
}
