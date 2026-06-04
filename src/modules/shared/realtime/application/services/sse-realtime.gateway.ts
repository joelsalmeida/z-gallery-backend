import type { RealtimeGatewayClient } from '@/modules/shared/realtime/application/ports';
import { RealtimeGatewayPort } from '@/modules/shared/realtime/application/ports';
import { RealtimeIntegrationEvent } from '@/modules/shared/realtime/domain/events/realtime-integration.event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SseRealtimeGateway implements RealtimeGatewayPort {
  private clients = new Map<string, Set<RealtimeGatewayClient>>();

  addClient(key: string, client: RealtimeGatewayClient) {
    if (!this.clients.has(key)) {
      this.clients.set(key, new Set());
    }

    this.clients.get(key)!.add(client);
  }

  removeClient(key: string, client: RealtimeGatewayClient) {
    this.clients.get(key)?.delete(client);
  }

  notify(key: string, event: RealtimeIntegrationEvent) {
    const clients = this.clients.get(key);

    if (!clients) return;

    for (const client of clients) {
      client.send(event.id.toValue(), event.serialize());
    }
  }
}
