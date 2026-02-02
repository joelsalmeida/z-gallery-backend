export class GetThumbnailFileQuery {
  constructor(
    public readonly albumId: string,
    public readonly photoId: string,
    public readonly userId: string,
  ) {}
}
