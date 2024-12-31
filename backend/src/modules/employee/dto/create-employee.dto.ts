import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the employee',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the employee',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password of the employee',
    required: true,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Refresh token of the employee',
  })
  @IsOptional()  
  refresh_token?: string | null;
}
