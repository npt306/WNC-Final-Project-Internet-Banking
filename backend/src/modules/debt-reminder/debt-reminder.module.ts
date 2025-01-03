import { Module } from '@nestjs/common';
import { DebtReminderService } from './debt-reminder.service';
import { DebtReminderController } from './debt-reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtReminder } from './entities/debt-reminder.entity';
import { DebtReminderNotificationModule } from '../debt-reminder-notification/debt-reminder-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtReminder]),
    DebtReminderNotificationModule,
],
  controllers: [DebtReminderController],
  providers: [DebtReminderService],
})
export class DebtReminderModule {}
