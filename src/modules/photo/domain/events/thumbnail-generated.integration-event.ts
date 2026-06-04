import { AlbumId } from '@/modules/album/domain/value-objects';
import { PhotoId } from '@/modules/photo/domain/value-objects';
import { THUMBNAIL_CHANNELS } from '@/queues/thumbnails/thumbnail.queue.contract';
import { IsUUID } from 'class-validator';
import { RealtimeIntegrationEvent } from '../../../shared/realtime/domain/events/realtime-integration.event';
import { RealtimeEventId } from '../../../shared/realtime/domain/value-objects';

class ThumbnailReadyPayload {
  @IsUUID()
  albumId!: string;

  @IsUUID()
  photoId!: string;
}

export class ThumbnailGeneratedIntegrationEvent extends RealtimeIntegrationEvent {
  static readonly ID = RealtimeEventId.create(THUMBNAIL_CHANNELS.READY);
  readonly id = ThumbnailGeneratedIntegrationEvent.ID;

  constructor(
    readonly albumId: AlbumId,
    readonly photoId: PhotoId,
  ) {
    super();
  }

  serialize(): string {
    return JSON.stringify({
      albumId: this.albumId.toValue(),
      photoId: this.photoId.toValue(),
    });
  }

  static deserialize(payload: string): ThumbnailGeneratedIntegrationEvent {
    const dto = this.parseDto(ThumbnailReadyPayload, payload);
    return this.fromDto(dto);
  }

  private static fromDto(dto: ThumbnailReadyPayload) {
    return new ThumbnailGeneratedIntegrationEvent(
      AlbumId.restore(dto.albumId),
      PhotoId.restore(dto.photoId),
    );
  }
}
