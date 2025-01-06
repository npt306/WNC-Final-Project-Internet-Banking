import { IsNotEmpty, IsString, IsNumber, IsDate, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class PayDebtReminderDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
    description: 'Debt reminder _id'
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
    example: '976432',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  codeOTP: string;
}
