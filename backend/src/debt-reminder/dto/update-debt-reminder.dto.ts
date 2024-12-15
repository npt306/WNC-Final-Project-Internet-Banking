import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtReminderDto } from './create-debt-reminder.dto';

export class UpdateDebtReminderDto extends PartialType(CreateDebtReminderDto) {}
