import { JwtAuthGuard } from '@/modules/auth/infrastructure/http/controller/guards';
import { RealtimeGatewayPort } from '@/modules/shared/realtime/application/ports';
import { Controller, Get, Inject, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

class SseConnection {
  constructor(private readonly response: Response) {}

  private keepAlive(): void {
    const INTERVAL_MS = 25_000;

    const heartbeatInterval = setInterval(() => {
      this.response.write(': heartbeat\n\n');
    }, INTERVAL_MS);

    this.response.on('close', () => {
      clearInterval(heartbeatInterval);
    });
  }

  initialize(): void {
    this.response.setHeader('Content-Type', 'text/event-stream');
    this.response.setHeader('Cache-Control', 'no-cache');
    this.response.setHeader('Connection', 'keep-alive');
    this.response.flushHeaders();

    this.response.write(': handshake\n\n');
    this.keepAlive();
  }

  send(eventName: string, eventData: string): void {
    this.response.write(`event: ${eventName}\n`);
    this.response.write(`data: ${eventData}\n\n`);
  }

  onClose(callback: () => void): void {
    this.response.on('close', callback);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('events')
export class RealtimeController {
  constructor(
    @Inject(RealtimeGatewayPort)
    private readonly gateway: RealtimeGatewayPort,
  ) {}

  @Get()
  connectEvents(@Param('albumId') albumId: string, @Res() res: Response) {
    const connection = new SseConnection(res);
    connection.initialize();

    const client = {
      send: (eventName: string, eventData: string) =>
        connection.send(eventName, eventData),
    };

    const subscriptionKey = albumId;

    this.gateway.addClient(subscriptionKey, client);

    connection.onClose(() => {
      this.gateway.removeClient(subscriptionKey, client);
    });
  }
}
