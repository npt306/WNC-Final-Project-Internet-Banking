import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DebtReminderNotificationService } from '../debt-reminder-notification.service';
import { Inject, forwardRef } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class AppGateway {

  constructor(
    @Inject(forwardRef(() => DebtReminderNotificationService))
    private readonly debtReminderNotificationService: DebtReminderNotificationService,
  ) {}

  @WebSocketServer()
  server: Server;

  private clientStates: Record<string, boolean> = {};
  private socketIdToUserId: Record<string, string> = {};

  isCustomerOnline(userId: string): boolean {
    return this.clientStates[userId] || false;
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const customerId = this.socketIdToUserId[client.id];
    if (customerId) {
      delete this.clientStates[customerId];
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('initialize')
  handleInitialize(
    @MessageBody() data: { id: string },
    @ConnectedSocket() client: Socket,
  ) {
    this.socketIdToUserId[client.id] = data.id;
    client.join(data.id); 
    this.clientStates[data.id] = true; 
    this.resendUnreadNotifications(data.id);
    console.log(`Client initialized with ID: ${data.id}`);
  }

  async resendUnreadNotifications(customerId: string) {
    const unreadNotifications = await this.debtReminderNotificationService.getUnreadCustomerNotifications(customerId);

    unreadNotifications.forEach((notification) => {
      this.server.to(customerId).emit('notification', notification);
            
      this.debtReminderNotificationService.markNotificationAsRead(notification._id);
    });
  }

  @SubscribeMessage('send')
  handleSend(
    @MessageBody() data: { recipientId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const recipientId = data.recipientId;
    if (recipientId in this.clientStates) {
      this.clientStates[recipientId] = !this.clientStates[recipientId];
      this.server
        .to(recipientId)
        .emit('receive', this.clientStates[recipientId]);
    }
  }
}
export default AppGateway;
