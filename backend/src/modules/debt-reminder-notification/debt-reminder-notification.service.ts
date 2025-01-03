import { Injectable } from '@nestjs/common';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { Repository } from 'typeorm';
import { AppGateway } from './socket/AppGetWay';

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

  async deleteCustomerNotifications(customerId: string): Promise<void> {
    await this.debtReminderNotificationRepository.delete({ customer_id: customerId });
  }

  async sendNotification(customerId: string, title: string, content: string): Promise<void> {
    const isOnline = this.appGateway.isCustomerOnline(customerId);

    if (isOnline) {
      // Gửi thông báo qua WebSocket
      this.appGateway.server.to(customerId).emit('notification', {
        customerId,
        title,
        content: content,
      });
      console.log(`Notification sent to online user: ${customerId}`);
    } else {
      // Lưu thông báo vào cơ sở dữ liệu
      const notification = this.debtReminderNotificationRepository.create({
        customer_id: customerId,
        title,
        content: content,
        createdAt: new Date(),
      });
      await this.debtReminderNotificationRepository.save(notification);
      console.log(`Notification saved for offline user: ${customerId}`);
    }
  }
}
