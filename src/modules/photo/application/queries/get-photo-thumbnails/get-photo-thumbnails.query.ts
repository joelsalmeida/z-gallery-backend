export class GetPhotoThumbnailsQuery {
  constructor(
    public readonly albumId: string,
    public readonly userId: string,
  ) {}
}
