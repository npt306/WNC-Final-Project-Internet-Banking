import {
  IsString,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTransferOTPDto {
  @ApiProperty({
    example: '677a5b07eecebc764770f97e',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({
      example: '976432',
      required: true,
  })
  @IsString()
  @IsNotEmpty()
  codeOTP: string;
}
