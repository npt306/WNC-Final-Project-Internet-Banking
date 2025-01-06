import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'nguyenvana',
    description: 'Username',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @ApiProperty({
    example: 'paswordday',
    description: 'Password',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty password !!!' })
  password: string;
}
