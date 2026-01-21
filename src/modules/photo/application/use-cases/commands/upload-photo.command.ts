import { PhotoFile } from '@/modules/photo/domain/value-objects';

export class UploadPhotoCommand {
  constructor(
    public readonly photoFile: PhotoFile,
    public readonly albumId: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
