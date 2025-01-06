import { BaseEntity, Column, Entity, ObjectIdColumn, Unique } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username'])
export class Customer extends BaseEntity {
  @ObjectIdColumn()
  _id?: ObjectId;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username of the customer',
    required: true,
  })
  @Column()
  username: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the customer',
    required: true,
  })
  @Column()
  full_name: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Email address of the customer',
    required: true,
  })
  @Column()
  email: string;

  @ApiProperty({
    example: '08012345678',
    description: 'Phone number of the customer',
    required: true,
  })
  @Column()
  phone: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed password of the customer',
    required: true,
  })
  @Column()
  password: string;

  @ApiProperty({
    example: '$2b$10$zvh7k8z6OJidFxoLV4d/mOKBkMMNc0H8IQz5QeTPt5ztXWa1LpCXa',
    description: 'Hashed refresh token of the customer',
  })
  @Column({ nullable: true })
  refresh_token: string | null;

  @ApiProperty({
    example: '951753',
    description: 'Code for reset password/OTP ',
  })
  @Column({ nullable: true })
  code: string | null;
}
