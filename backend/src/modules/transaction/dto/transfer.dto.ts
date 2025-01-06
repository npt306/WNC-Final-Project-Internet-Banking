import {
  IsString,
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionDto,
} from './transaction.dto';
import { SupportedBank } from '@/constants/supported-bank.enum';
import { TransactionType } from '@/constants/transaction-type.enum';

export class TransferDto implements TransactionDto {
  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @IsString()
  sender: string;

  @ApiProperty({
    example: '556677889900',
    required: true,
  })
  @IsString()
  receiver: string;

  @ApiProperty({
    example: SupportedBank.DEFAULT,
    required: true,
  })
  @IsString()
  @IsOptional()
  @IsEnum(SupportedBank)
  sender_bank?: string;

  @ApiProperty({
    example: SupportedBank.DEFAULT,
    required: true,
  })
  @IsString()
  @IsOptional()
  @IsEnum(SupportedBank)
  receiver_bank?: string;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @IsOptional()
  fee: number;

  @ApiProperty({
    example: 'Transfer money',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @IsString()
  payer: string;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @ApiProperty({
    example: TransactionType.TRANSFER,
    required: true,
  })
  @IsString()
  @IsEnum(TransactionType)
  type: string;
}
