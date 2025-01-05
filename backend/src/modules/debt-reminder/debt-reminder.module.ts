import { Module } from '@nestjs/common';
import { DebtReminderService } from './debt-reminder.service';
import { DebtReminderController } from './debt-reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtReminder } from './entities/debt-reminder.entity';
import { DebtReminderNotificationModule } from '../debt-reminder-notification/debt-reminder-notification.module';
import { AccountModule } from '../account/account.module';
import { TransactionModule } from '../transaction/transaction.module';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtReminder, Customer]),
    DebtReminderNotificationModule,
    AccountModule,
    CustomerModule,
    TransactionModule,
],
  controllers: [DebtReminderController],
  providers: [DebtReminderService],
})
export class DebtReminderModule {}
