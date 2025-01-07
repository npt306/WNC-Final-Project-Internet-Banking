import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalSearchDto {
  @ApiProperty({
    example: '73336867059848144273',
    description: 'Account number of external customer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}
