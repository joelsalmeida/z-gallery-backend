import { AlbumId } from '@/modules/album/domain/value-objects';
import { Photo } from '@/modules/photo/domain/photo';
import {
  Color,
  FileSize,
  PhotoCreationDate,
  PhotoDescription,
  PhotoId,
  PhotoLocation,
  PhotoTitle,
  ThumbnailLocation,
} from '@/modules/photo/domain/value-objects';
import { PrismaService } from '@/modules/shared/prisma/prisma.service';

import { Injectable } from '@nestjs/common';
import { PhotoRepository } from '../../application/ports/out';

@Injectable()
export class PrismaPhotoRepository implements PhotoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(photo: Photo): Promise<void> {
    await this.prisma.photo.create({
      data: {
        id: photo.id.toValue(),
        albumId: photo.albumId.toValue(),
        title: photo.title.toValue(),
        description: photo.description.toValue(),
        size: photo.size.toValue(),
        predominantColor: photo.predominantColor.toValue(),
        location: photo.location.toValue(),
        creationDate: photo.creationDate.toValue(),
        thumbnailLocation: photo.thumbnailLocation?.toValue(),
      },
    });
  }

  async update(photo: Photo): Promise<void> {
    await this.prisma.photo.update({
      where: { id: photo.id.toValue() },
      data: {
        thumbnailLocation: photo.thumbnailLocation
          ? photo.thumbnailLocation.toValue()
          : null,
        title: photo.title.toValue(),
        description: photo.description.toValue(),
      },
    });
  }

  async findById(id: PhotoId): Promise<Photo | null> {
    const record = await this.prisma.photo.findUnique({
      where: { id: id.toValue() },
    });

    if (!record) return null;

    return Photo.restore(
      PhotoId.restore(record.id),
      AlbumId.restore(record.albumId),
      PhotoTitle.restore(record.title),
      PhotoDescription.restore(record.description),
      FileSize.fromBytes(record.size),
      Color.fromHex(record.predominantColor),
      PhotoLocation.create(record.location),
      PhotoCreationDate.fromDate(record.creationDate),
      record.thumbnailLocation
        ? ThumbnailLocation.restore(record.thumbnailLocation)
        : null,
    );
  }

  async findAllByAlbumId(albumId: AlbumId): Promise<Photo[]> {
    const records = await this.prisma.photo.findMany({
      where: { albumId: albumId.toValue() },
      orderBy: { creationDate: 'asc' },
    });

    // TODO: DRY.
    return records.map((record) =>
      Photo.restore(
        PhotoId.restore(record.id),
        AlbumId.restore(record.albumId),
        PhotoTitle.restore(record.title),
        PhotoDescription.restore(record.description),
        FileSize.fromBytes(record.size),
        Color.fromHex(record.predominantColor),
        PhotoLocation.create(record.location),
        PhotoCreationDate.fromDate(record.creationDate),
      ),
    );
  }

  async exists(id: PhotoId): Promise<boolean> {
    const record = await this.prisma.photo.findUnique({
      where: { id: id.toValue() },
      select: { id: true },
    });

    return record !== null;
  }

  async deleteById(id: PhotoId): Promise<void> {
    await this.prisma.photo.delete({
      where: { id: id.toValue() },
    });
  }
}
