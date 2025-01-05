import { Module } from '@nestjs/common';
import { DebtReminderNotificationService } from './debt-reminder-notification.service';
import { DebtReminderNotificationController } from './debt-reminder-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtReminderNotification } from './entities/debt-reminder-notification.entity';
import { AppGateway } from './socket/AppGetWay';
@Module({
  imports: [TypeOrmModule.forFeature([DebtReminderNotification])],
  controllers: [DebtReminderNotificationController],
  providers: [DebtReminderNotificationService, AppGateway],
  exports: [DebtReminderNotificationService],
})
export class DebtReminderNotificationModule {}
