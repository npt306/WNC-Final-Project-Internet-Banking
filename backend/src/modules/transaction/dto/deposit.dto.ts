import {
  IsString,
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto, TransactionType } from './transaction.dto';

export class DepositDto implements TransactionDto {
  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  content: string = 'Deposit from bank';

  @IsNumber()
  @IsOptional()
  receiver_balance: number;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @IsString()
  @IsEnum(TransactionType)
  type: string = 'DEPOSIT';
}
