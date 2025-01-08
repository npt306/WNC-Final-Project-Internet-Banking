import { PartialType } from '@nestjs/swagger';
import { CreateDebtReminderNotificationDto } from './create-debt-reminder-notification.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDebtReminderNotificationDto extends PartialType(
  CreateDebtReminderNotificationDto,
) {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ example: '675babee10466a57086768eb' })
  @IsOptional()
  @IsString()
  id_debt?: string;
}
