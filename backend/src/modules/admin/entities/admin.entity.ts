import { Entity, Column, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Admin extends BaseEntity {
  @ObjectIdColumn()
  _id?: ObjectId;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the admin',
    required: true,
  })
  @Column({})
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the admin',
    required: true,
  })
  @Column()
  full_name: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email address of the admin',
    required: true,
  })
  @Column()
  email: string;

  @ApiProperty({
    example:
      '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Password of the admin',
    required: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    example:
      '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Refresh token of the admin',
  })
  @Column({ nullable: true })
  refresh_token: string | null;
}
