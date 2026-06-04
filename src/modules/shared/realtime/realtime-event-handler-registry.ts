import { RealtimeEventId } from '@/modules/shared/realtime/domain/value-objects';
import { RealtimeEventHandler } from '@/modules/shared/realtime/realtime-event-handler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RealtimeEventHandlerRegistry {
  private readonly handlers = new Map<string, RealtimeEventHandler>();

  constructor(handlers: RealtimeEventHandler[]) {
    for (const handler of handlers) {
      this.handlers.set(handler.eventId.toValue(), handler);
    }
  }

  get(eventName: RealtimeEventId): RealtimeEventHandler | undefined {
    return this.handlers.get(eventName.toValue());
  }
}
