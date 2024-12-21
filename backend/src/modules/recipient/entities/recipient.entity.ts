import { Column, Entity, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Recipient extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @Column()
  customer_id: string;

  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @Column()
  account_number: string;

  @ApiProperty({
    example: 'Uncle John',
    required: true,
  })
  @Column()
  nickname: string;

  @ApiProperty({
    example: 'default',
    required: true,
  })
  @Column()
  bank: string;
}
