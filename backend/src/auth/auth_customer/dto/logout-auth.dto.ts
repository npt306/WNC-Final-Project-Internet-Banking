import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class LogoutAuthDto {
  @ApiProperty({
    example: 'nguyenvana',
    description: 'Username',
    required: true,
  })
  @IsNotEmpty({ message: 'Empty username !!!' })
  username: string;

  @ApiProperty({
    example: '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Refresh token',
    required: true,
  })
  @IsNotEmpty()
  refresh_token?: string | null;
}
