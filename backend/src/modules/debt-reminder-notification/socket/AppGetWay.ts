import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  private clientStates: Record<string, number> = {};
  private counters: Record<string, number> = {};
  private isIncreasing: Record<string, boolean> = {};

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('initialize')
  handleInitialize(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.id);
    this.clientStates[data.id] = 1;
    this.counters[data.id] = 1;
    this.isIncreasing[data.id] = true;
    console.log(`Client initialized with ID: ${data.id}`);
  }

  @SubscribeMessage('send')
  handleSend(
    @MessageBody() data: { recipientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const recipientId = data.recipientId;
    if (recipientId in this.clientStates) {
      if (this.isIncreasing[recipientId]) {
        this.counters[recipientId]++;
        if (this.counters[recipientId] >= 10) {
          this.isIncreasing[recipientId] = false;
        }
      } else {
        this.counters[recipientId]--;
        if (this.counters[recipientId] <= 1) {
          this.isIncreasing[recipientId] = true;
        }
      }

      this.clientStates[recipientId] = this.counters[recipientId];
      this.server.to(recipientId).emit('receive', this.counters[recipientId]);
    }
  }
}

export default AppGateway;
