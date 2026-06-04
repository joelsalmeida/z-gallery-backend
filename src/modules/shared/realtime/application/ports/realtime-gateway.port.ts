import { RealtimeIntegrationEvent } from '../../domain/events/realtime-integration.event';

export type RealtimeGatewayClient = {
  send: (eventName: string, eventData: string) => void;
};

export abstract class RealtimeGatewayPort {
  abstract addClient(key: string, client: RealtimeGatewayClient): void;

  abstract removeClient(key: string, client: RealtimeGatewayClient): void;

  abstract notify(key: string, event: RealtimeIntegrationEvent): void;
}
