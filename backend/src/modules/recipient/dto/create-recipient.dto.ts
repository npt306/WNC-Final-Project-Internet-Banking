import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecipientDto {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  customer_id: string;

  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    example: 'Uncle John',
    required: false,
  })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({
    example: 'default',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bank: string;
}
