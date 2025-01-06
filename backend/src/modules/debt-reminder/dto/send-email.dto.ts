import { IsNotEmpty, IsString, IsNumber, IsDate, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SendEmailDebtReminderDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    description: 'Debt reminder _id',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  _id: string;
}
