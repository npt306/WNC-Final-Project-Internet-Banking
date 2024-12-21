import { Module } from '@nestjs/common';
import { DebtReminderService } from './debt-reminder.service';
import { DebtReminderController } from './debt-reminder.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtReminder } from './entities/debt-reminder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DebtReminder])],
  controllers: [DebtReminderController],
  providers: [DebtReminderService],
})
export class DebtReminderModule {}
