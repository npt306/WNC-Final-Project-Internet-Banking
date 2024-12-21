import{ IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the customer',
    required: true
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
    required: true
  })
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the customer',
    required: true
  })
  email: string;

  @ApiProperty({
    example: '08012345678',
    description: 'Phone number of the customer',
    required: true
  })
  phone: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed password of the customer',
    required: true
  })
  password: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed refresh token confirmation',
    required: true
  })
  refresh_token?: string | null;
}
