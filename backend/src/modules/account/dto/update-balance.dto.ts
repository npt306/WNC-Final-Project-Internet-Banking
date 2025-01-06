import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateBalanceDto {
  @ApiProperty({
    example: '112233445566',
    description: 'Account number',
  })
  @IsNotEmpty()
  @IsString()
  account_number: string;

  @ApiProperty({
    example: 1000000,
    description: 'New balance amount',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  balance: number;
}
