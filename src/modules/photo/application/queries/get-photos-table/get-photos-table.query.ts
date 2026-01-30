export class GetPhotosTableQuery {
  constructor(
    public readonly albumId: string,
    public readonly userId: string,
  ) {}
}
