import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity('debt-reminder')
export class DebtReminder extends BaseEntity {
  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @Column()
  creditor: string;

  @ApiProperty({
    example: '675babee10466a57086768eb',
    required: true,
  })
  @Column()
  debtor: string;

  @ApiProperty({
    example: '10000000',
    required: true,
  })
  @Column()
  amount: number;

  @ApiProperty({
    example: 'You owe me money',
    required: true,
  })
  @Column()
  message: string;

  @ApiProperty({
    example: '2021-09-01T00:00:00.000Z',
    required: true,
  })
  @Column()
  createdAt: Date = new Date();

  @ApiProperty({
    example: 'Pending',
    required: true,
  })
  @Column()
  status: string = 'Pending';
}
