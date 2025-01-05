import { Module } from '@nestjs/common';
import { DebtReminderNotificationService } from './debt-reminder-notification.service';
import { DebtReminderNotificationController } from './debt-reminder-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DebtReminderNotification])],
  controllers: [DebtReminderNotificationController],
  providers: [DebtReminderNotificationService],
  exports: [DebtReminderNotificationService],
})
export class DebtReminderNotificationModule {}
