import { PartialType } from '@nestjs/swagger';
import { CreateDebtReminderNotificationDto } from './create-debt-reminder-notification.dto';

export class UpdateDebtReminderNotificationDto extends PartialType(CreateDebtReminderNotificationDto) {}
