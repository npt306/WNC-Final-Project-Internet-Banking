import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsPhoneNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the customer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the customer',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '08012345678',
    description: 'Phone number of the customer',
    required: true,
  })
  @IsPhoneNumber(null) 
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed password of the customer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6) 
  password: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed refresh token confirmation',
    required: true,
  })
  @IsOptional() 
  @IsString()
  refresh_token?: string | null;
}
