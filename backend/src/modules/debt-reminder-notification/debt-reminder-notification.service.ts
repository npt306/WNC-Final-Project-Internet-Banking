import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class DebtReminderNotificationService {
  constructor(
    @InjectRepository(DebtReminderNotification)
    private debtReminderNotificationRepository: Repository<DebtReminderNotification>,
  ) {}

  async create(
    createDto: CreateDebtReminderNotificationDto,
  ): Promise<DebtReminderNotification> {
    const notification = this.debtReminderNotificationRepository.create({
      ...createDto,
      id_debt: createDto.id_debt || '',
      isRead: false,
      createdAt: new Date(),
    });
    return await this.debtReminderNotificationRepository.save(notification);
  }

  async findAll(): Promise<DebtReminderNotification[]> {
    return await this.debtReminderNotificationRepository.find();
  }

  async findOne(id: string): Promise<DebtReminderNotification> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const notification =
      await this.debtReminderNotificationRepository.findOneBy({
        _id: new ObjectId(id),
      });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async update(
    id: string,
    updateDto: UpdateDebtReminderNotificationDto,
  ): Promise<DebtReminderNotification> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const notification = await this.findOne(id);
    await this.debtReminderNotificationRepository.update(
      { _id: new ObjectId(id) },
      updateDto,
    );
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const notification = await this.findOne(id);
    await this.debtReminderNotificationRepository.delete({
      _id: new ObjectId(id),
    });
  }

  async getCustomerNotifications(
    customerId: string,
  ): Promise<DebtReminderNotification[]> {
    return this.debtReminderNotificationRepository.find({
      where: { customer_id: customerId },
    });
  }

  async markAsRead(id: string): Promise<DebtReminderNotification> {
    return this.update(id, { isRead: true });
  }
}
