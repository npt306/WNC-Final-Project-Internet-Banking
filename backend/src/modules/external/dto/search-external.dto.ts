import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class SearchExternalDto {
  @ApiProperty({
    example: '112233445566',
    description: 'Account number',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  accountNumber: string;
}
