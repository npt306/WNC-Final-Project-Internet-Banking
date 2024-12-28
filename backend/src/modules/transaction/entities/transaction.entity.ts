import { Entity, Column, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';

// RECEIVE LOG:     query receiver = thisAcc
// TRANSFER LOG:    query sender = thisAcc
// DEPOSIT LOG:     sender == null
// DEBT:            query sender = thisAcc, isPaid !=  null

@Entity()
export class Transaction extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ nullable: true })
  sender?: string; // NULL if from employee

  @Column()
  receiver: string;

  @Column({ nullable: true })
  sender_bank?: string;

  @Column({ nullable: true })
  receiver_bank?: string;

  @Column()
  amount: number;
  // transaction fee = amound*2%

  @Column()
  content: string;

  @Column({ nullable: true })
  sender_balance?: number;

  @Column()
  receiver_balance: number;

  @Column({ nullable: true })
  payer?: string; // NULL if from employee

  @Column()
  timestamp: Date;

  @Column()
  type: string; // TRANSFER, DEPOSIT, DEBT
}
