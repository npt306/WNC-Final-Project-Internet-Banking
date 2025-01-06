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

  private clientStates: Record<string, boolean> = {};

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
    this.clientStates[data.id] = true;
    console.log(`Client initialized with ID: ${data.id}`);
  }

  @SubscribeMessage('send')
  handleSend(
    @MessageBody() data: { recipientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const recipientId = data.recipientId;
    if (recipientId in this.clientStates) {
      const newState = Math.random() > 0.5; 
      this.clientStates[recipientId] = newState;

      this.server.to(recipientId).emit('receive', newState);
    }
  }

}
export default AppGateway;

