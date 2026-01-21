export class DeleteAlbumCommand {
  constructor(
    public readonly albumId: string,
    public readonly ownerId: string,
  ) {}
}
