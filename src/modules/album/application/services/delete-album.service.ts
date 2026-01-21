import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AlbumRepository } from '../../application/ports/out';
import { AlbumId } from '../../domain/value-objects';
import { AlbumNotFoundException } from '../exceptions';
import { DeleteAlbumUseCase } from '../use-cases';
import { DeleteAlbumCommand } from '../use-cases/commands';

@Injectable()
export class DeleteAlbumService implements DeleteAlbumUseCase {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async execute(command: DeleteAlbumCommand): Promise<void> {
    const albumId = AlbumId.restore(command.albumId);
    const ownerId = UserId.restore(command.ownerId);
    const album = await this.albumRepository.findById(albumId);

    if (!album) {
      throw new AlbumNotFoundException();
    }

    if (!album.isOwnedBy(ownerId)) {
      throw new UnauthorizedException();
    }

    await this.albumRepository.deleteById(albumId);
  }
}
