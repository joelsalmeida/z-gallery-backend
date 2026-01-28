export class DeletePhotoCommand {
  constructor(
    public readonly albumId: string,
    public readonly photoId: string,
    public readonly ownerId: string,
  ) {}
}
