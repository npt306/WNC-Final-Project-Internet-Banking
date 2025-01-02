import {
  IsString,
  IsNumber,
  Min,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedBank, TransactionDto, TransactionType } from './transaction.dto';

export class ExternalTransferDto implements TransactionDto {
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
  @IsEnum(SupportedBank)
  sender_bank: string;

  @ApiProperty({
    example: 'Test Bank',
    required: true,
  })
  @IsString()
  @IsEnum(SupportedBank)
  receiver_bank: string;

  @IsNumber()
  @IsOptional()
  sender_balance: number;

  @IsNumber()
  @IsOptional()
  receiver_balance: number;

  @ApiProperty({
    example: '100000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    example: 'External Transfer money',
    required: true,
  })
  @IsString()
  content: string;

  @IsDate()
  timestamp: Date = new Date(Date.now());

  @IsString()
  @IsEnum(TransactionType)
  type: string = "TRANSFER";
}
