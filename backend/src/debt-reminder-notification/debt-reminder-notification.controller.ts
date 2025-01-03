import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtReminderNotificationService } from './debt-reminder-notification.service';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';

@Controller('debt-reminder-notification')
export class DebtReminderNotificationController {
  constructor(private readonly debtReminderNotificationService: DebtReminderNotificationService) {}

  @Get()
  findAll() {
    return this.debtReminderNotificationService.sendNotification("1", "title test", "content test");
  }
 
}
