import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional, IsNumber } from 'class-validator';

export class TransferDto {
  @ApiProperty({
    example: '98765432101',
    description: 'Account number of sender',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  fromAccountNumber: string;

  @ApiProperty({
    example: '98765432101',
    description: 'Account number of receiver',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  toAccountNumber: string;

  @ApiProperty({
    example: '10000',
    description: 'Amount of money',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    example: 'Customer A transfer money',
    description: 'Description of money transfer',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  description: string;
}
