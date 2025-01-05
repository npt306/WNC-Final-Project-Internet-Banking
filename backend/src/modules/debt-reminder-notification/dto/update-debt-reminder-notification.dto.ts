import { PartialType } from '@nestjs/swagger';
import { CreateDebtReminderNotificationDto } from './create-debt-reminder-notification.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDebtReminderNotificationDto extends PartialType(
  CreateDebtReminderNotificationDto,
) {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
