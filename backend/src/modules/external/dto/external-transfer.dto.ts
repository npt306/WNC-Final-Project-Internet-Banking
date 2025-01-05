import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class ExternalTransferDto {
  @ApiProperty({
    example: '98765432101',
    description: 'Other bank account number of sender',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fromAccountNumber: string;

  @ApiProperty({
    example: '112233445566',
    description: 'Sankcomba account number of receiver',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  toAccountNumber: string;

  @ApiProperty({
    example: '100000',
    description: 'Amount of money',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: 'Transfer money from other bank',
    description: 'Description of money transfer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
