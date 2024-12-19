import { IsNotEmpty, IsString, IsNumber, IsDate, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDebtReminderDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  creditor: string;

  @ApiProperty({
    example: '675babee10466a57086768eb',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  debtor: string;

  @ApiProperty({
    example: '10000000',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'You owe me money',
    required: true,
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    example: 'Pending',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}
