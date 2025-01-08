import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    example: '675babee10466a57086768eb',
    required: false,
    description: 'ID of the debt reminder',
  })
  @IsOptional()
  @IsString()
  id_debt?: string;
}
