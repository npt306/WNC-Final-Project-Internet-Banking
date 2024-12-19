import { Entity, Column, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Employee extends BaseEntity {
  @ObjectIdColumn()
  _id?: ObjectId;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the employee',
    required: true
  })
  @Column()
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the employee',
    required: true
  })
  @Column()
  full_name: string;

  @ApiProperty({
    example: 'employee2@example.com',
    description: 'Email address of the employee',
    required: true
  })
  @Column()
  email: string;

  @ApiProperty({
    example: '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Password of the employee',
    required: true
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '$argon2id$v=19$m=65536,t=3,p=4$5cfw5/j7oOZMEeKXKKRLOQ$riPb/Mf5HZKqNQpAyjCFAgQzRxK16H4QlFQCuMFjKQA',
    description: 'Refresh token of the employee',
  })
  @Column({ nullable: true })
  refresh_token: string | null;
}
