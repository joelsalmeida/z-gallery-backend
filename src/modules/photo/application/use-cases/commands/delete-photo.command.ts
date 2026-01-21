export class DeletePhotoCommand {
  constructor(
    public readonly photoId: string,
    public readonly ownerId: string,
  ) {}
}
