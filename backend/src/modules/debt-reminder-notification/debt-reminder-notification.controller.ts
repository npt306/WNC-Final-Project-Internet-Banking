import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DebtReminderNotificationService } from './debt-reminder-notification.service';
import { CreateDebtReminderNotificationDto } from './dto/create-debt-reminder-notification.dto';
import { UpdateDebtReminderNotificationDto } from './dto/update-debt-reminder-notification.dto';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('debt-reminder-notification')
export class DebtReminderNotificationController {
  constructor(private readonly debtReminderNotificationService: DebtReminderNotificationService) {}

  @Get()
  findAll() {
    return this.debtReminderNotificationService.sendNotification("1", "title test", "content test");
  }
 
  @ApiResponse({
    status: 200,
    description: 'Return all notifications of a customer.',
    type: [DebtReminderNotification],
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'Customer ID',
    example: '1',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DebtReminderNotification[]> {
    return this.debtReminderNotificationService.getCustomerNotifications(id);
  }
}
