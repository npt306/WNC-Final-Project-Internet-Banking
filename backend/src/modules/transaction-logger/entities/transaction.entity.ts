import { Entity, Column, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';

// RECEIVE LOG:     query receiver = thisAcc
// TRANSFER LOG:    query sender = thisAcc
// DEPOSIT LOG:     sender == null
// UNPAID LOAN:     query receiver = thisAcc, isPaid != null
// DEBT:            query sender = thisAcc, isPaid !=  null

@Entity()
export class Transaction extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  sender?: string; // NULL if from employee

  @Column()
  receiver: string;

  @Column()
  bank: string;

  @Column()
  amount: number;
  // transaction fee = amound*2%

  @Column()
  content: string;

  @Column({ nullable: true })
  payer?: string; // NULL if from employee

  @Column()
  timestamp: string;

  @Column()
  type: string; // RECEIVE, TRANSFER, DEPOSIT, DEBT

  @Column({ nullable: true })
  isPaid?: boolean; // !NULL if is DEBT
}
