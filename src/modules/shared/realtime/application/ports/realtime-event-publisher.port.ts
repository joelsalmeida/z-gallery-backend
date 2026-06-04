import { RealtimeIntegrationEvent } from '../../domain/events/realtime-integration.event';

export abstract class RealtimeEventPublisherPort {
  abstract publish(event: RealtimeIntegrationEvent): Promise<void>;
}
