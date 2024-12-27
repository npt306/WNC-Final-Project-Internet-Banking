import { ApiProperty } from '@nestjs/swagger';
export class CreateEmployeeDto {
  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the employee',
    required: true,
  })
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
    required: true,
  })
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the employee',
    required: true,
  })
  email: string;

  @ApiProperty({
    example:
      '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Password of the employee',
    required: true,
  })
  password: string;

  @ApiProperty({
    example:
      '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Refresh token of the employee',
  })
  refresh_token?: string | null;
}
