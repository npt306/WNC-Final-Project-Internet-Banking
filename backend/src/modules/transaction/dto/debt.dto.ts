import { IsString, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class DebtDto implements TransactionDto {
  @ApiProperty({
    example: '556677889900',
    required: true,
  })
  @IsString()
  sender: string;

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

  @ApiProperty({
    example: 'Pay debt',
    required: true,
  })
  @IsString()
  content: string;

  @IsNumber()
  @IsOptional()
  sender_balance: number;

  @IsNumber()
  @IsOptional()
  receiver_balance: number;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @IsString()
  type: string = 'DEBT';
}
