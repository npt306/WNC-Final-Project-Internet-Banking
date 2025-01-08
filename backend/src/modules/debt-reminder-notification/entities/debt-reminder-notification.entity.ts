import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';

@Entity('debt-reminder-notification')
export class DebtReminderNotification {
  @ApiProperty({ example: '677967bfaf7b2bc25bfdff1e' })
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({ example: '1' })
  @Column()
  customer_id: string;

  @ApiProperty({ example: 'title test' })
  @Column()
  title: string;

  @ApiProperty({ example: 'content test' })
  @Column()
  content: string;

  @ApiProperty({ example: '675babee10466a57086768eb' })
  @Column()
  id_debt: string;

  @ApiProperty({ example: 'false' })
  @Column()
  isRead: boolean;

  @ApiProperty({ example: '2021-10-10T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
