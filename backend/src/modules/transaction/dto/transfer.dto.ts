import {
  IsString,
  IsNumber,
  Min,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedBank, TransactionDto, TransactionType } from './transaction.dto';

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
    example: 'Sankcomba',
    required: true,
  })
  @IsString()
  @IsOptional()
  @IsEnum(SupportedBank)
  sender_bank?: string;

  @ApiProperty({
    example: 'Test Bank',
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
  @IsOptional()
  payer: string | null;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @ApiProperty({
    example: 'TRANSFER',
    required: true,
  })
  @IsString()
  @IsEnum(TransactionType)
  type: string;
}
