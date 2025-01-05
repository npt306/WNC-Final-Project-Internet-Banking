import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDebtReminderDto {
  @ApiProperty({ example: '675babee10466a57086768eb' })
  @IsNotEmpty()
  @IsString()
  creditor: string;

  @ApiProperty({ example: '675babee10466a57086768ec' })
  @IsNotEmpty()
  @IsString()
  debtor: string;

  @ApiProperty({ example: 10000000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'You owe me money' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({ example: 'Pending' })
  @IsNotEmpty()
  @IsString()
  status: string;
}
