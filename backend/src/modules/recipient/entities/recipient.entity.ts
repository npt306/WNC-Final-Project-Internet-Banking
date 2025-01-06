import { Column, Entity, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedBank } from '@/constants/supported-bank.enum';

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
    required: false,
  })
  @Column()
  nickname?: string;

  @ApiProperty({
    example: SupportedBank.DEFAULT,
    required: true,
  })
  @Column()
  bank: string;
}
