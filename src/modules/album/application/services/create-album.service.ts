import { UserId } from '@/modules/user/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { Album } from '../../domain/album';
import { AlbumDescription, AlbumTitle } from '../../domain/value-objects';
import { AlbumRepository } from '../ports/out/album.repository';
import { CreateAlbumUseCase } from '../use-cases';
import { CreateAlbumCommand } from '../use-cases/commands';

@Injectable()
export class CreateAlbumService implements CreateAlbumUseCase {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async execute(command: CreateAlbumCommand): Promise<Album> {
    const album = Album.create(
      UserId.restore(command.ownerId),
      AlbumTitle.create(command.title),
      AlbumDescription.create(command.description),
    );
    await this.albumRepository.save(album);
    return album;
  }
}
