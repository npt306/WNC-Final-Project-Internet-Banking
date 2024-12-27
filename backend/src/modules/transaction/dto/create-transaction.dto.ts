import { IsString, IsNumber, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @IsString()
  sender?: string | null;

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

  @ApiProperty({
    example: '10000000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  sender_balance: number;

  @ApiProperty({
    example: '10000000',
    required: true,
  })
  @IsNumber()
  @Min(0)
  receiver_balance: number;

  @ApiProperty({
    example: 'sender id',
    required: true,
  })
  @IsString()
  payer?: string | null;

  @ApiProperty({
    example: '2024-12-25T20:30:00.000Z',
    required: true,
  })
  @IsString()
  timestamp: string;

  @ApiProperty({
    example: 'TRANSFER',
    required: true,
  })
  @IsString()
  type: string;
}
