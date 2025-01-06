import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({
    example: 'nguyenvana',
    description: 'Username of customer',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Fullname of customer',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty fullname !!!' })
  full_name: string;

  @ApiProperty({
    example: 'nguyenvana@gmail.com',
    description: 'Email of customer',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty email !!!' })
  email: string;

  @ApiProperty({
    example: 'toilanguyenvana',
    description: 'Password of customer',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty password !!!' })
  password: string;

  @IsOptional()
  refresh_token?: string | null;
}
