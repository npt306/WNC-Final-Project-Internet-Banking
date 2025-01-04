import { Injectable } from '@nestjs/common';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { Repository } from 'typeorm';
import { AppGateway } from './socket/AppGetWay';
import { ObjectId } from 'mongodb';

@Injectable()
export class DebtReminderNotificationService {
  constructor(
    @InjectRepository(DebtReminderNotification)
    private debtReminderNotificationRepository: Repository<DebtReminderNotification>,
    private readonly appGateway: AppGateway,
  ) {}

  async getCustomerNotifications(customerId: string): Promise<DebtReminderNotification[]> {
    return this.debtReminderNotificationRepository.find({
      where: { customer_id: customerId },
    });
  }

  async getUnreadCustomerNotifications(customerId: string): Promise<DebtReminderNotification[]> {
    return this.debtReminderNotificationRepository.find({
      where: { customer_id: customerId, isRead: false },
    });
  }

  async deleteCustomerNotifications(customerId: string): Promise<void> {
    await this.debtReminderNotificationRepository.delete({ customer_id: customerId });
  }

  async markNotificationAsRead(notificationId: ObjectId): Promise<void> {
    await this.debtReminderNotificationRepository.update(
      { _id: notificationId },
      { isRead: true },
    );
  }

  async sendNotification(customerId: string, title: string, content: string): Promise<void> {
    const isOnline = this.appGateway.isCustomerOnline(customerId);
    let isRead = true;
    console.log('online: ' + isOnline);
    if (isOnline) {
      // Gửi thông báo qua WebSocket
      this.appGateway.server.to(customerId).emit('notification', {
        customerId,
        title: title,
        content: content,
      });
    } else {
      isRead = false
    }
    
    const notification = this.debtReminderNotificationRepository.create({
      customer_id: customerId,
      title: title,
      content: content,
      isRead: isRead,
      createdAt: new Date(),
    });
    await this.debtReminderNotificationRepository.save(notification);
  }
}
