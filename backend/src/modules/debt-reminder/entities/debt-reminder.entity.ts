import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity('debt-reminder')
export class DebtReminder {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({ example: '675babee10466a57086768eb' })
  @Column()
  creditor: string;

  @ApiProperty({ example: '675babee10466a57086768ec' })
  @Column()
  debtor: string;

  @ApiProperty({ example: 10000000 })
  @Column()
  amount: number;

  @ApiProperty({ example: 'You owe me money' })
  @Column()
  message: string;

  @ApiProperty({ example: 'Pending' })
  @Column()
  status: string;

  @ApiProperty()
  @Column()
  createdAt: Date;
}
