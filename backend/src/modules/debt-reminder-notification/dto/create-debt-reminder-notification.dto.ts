import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDebtReminderNotificationDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @ApiProperty({ example: 'Payment Reminder' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Your payment is due' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
