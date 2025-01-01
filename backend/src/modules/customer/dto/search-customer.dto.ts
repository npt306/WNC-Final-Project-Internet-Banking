import { ApiProperty } from '@nestjs/swagger';

export class SearchCustomerDto {
    
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the customer',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
    required: true,
  })
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the customer',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '08012345678',
    description: 'Phone number of the customer',
    required: true,
  })
  phone: string;
}
