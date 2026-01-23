export class GetPhotoFileQuery {
  constructor(
    public readonly photoId: string,
    public readonly requester: string,
  ) {}
}
