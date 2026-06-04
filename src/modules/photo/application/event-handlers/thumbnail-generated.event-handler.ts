import { RealtimeEventHandler } from '@/modules/shared/realtime/realtime-event-handler';
import { Injectable } from '@nestjs/common';
import { ThumbnailGeneratedIntegrationEvent } from '../../domain/events/thumbnail-generated.integration-event';

@Injectable()
export class ThumbnailGeneratedHandler implements RealtimeEventHandler<ThumbnailGeneratedIntegrationEvent> {
  readonly eventId = ThumbnailGeneratedIntegrationEvent.ID;

  deserialize(payload: string): ThumbnailGeneratedIntegrationEvent {
    return ThumbnailGeneratedIntegrationEvent.deserialize(payload);
  }

  getKey(event: ThumbnailGeneratedIntegrationEvent): string {
    return event.albumId.toValue();
  }
}
