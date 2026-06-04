import { RealtimeIntegrationEvent } from './domain/events/realtime-integration.event';
import { RealtimeEventId } from './domain/value-objects';

export interface RealtimeEventHandler<
  T extends RealtimeIntegrationEvent = RealtimeIntegrationEvent,
> {
  readonly eventId: RealtimeEventId;

  deserialize(payload: string): T;

  getKey(event: T): string;
}

export const REALTIME_EVENT_HANDLERS = Symbol('REALTIME_EVENT_HANDLERS');
