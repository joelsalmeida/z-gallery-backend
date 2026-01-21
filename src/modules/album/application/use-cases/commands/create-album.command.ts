export class CreateAlbumCommand {
  constructor(
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
