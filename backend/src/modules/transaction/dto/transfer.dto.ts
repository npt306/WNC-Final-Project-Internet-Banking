import { IsString, IsNumber, Min, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction.dto';

export class TransferDto implements TransactionDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @IsString()
  sender: string;

  @ApiProperty({
    example: '675babee10466a57086768eb',
    required: true,
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    example: 'bank A',
    required: true,
  })
  @IsString()
  sender_bank: string;

  @ApiProperty({
    example: 'bank B',
    required: true,
  })
  @IsString()
  receiver_bank: string;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'Transfer money',
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

  @ApiProperty({
    example: 'sender id',
    required: true,
  })
  @IsString()
  @IsOptional()
  payer: string | null;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @IsString()
  type: string = 'TRANSFER';
}
