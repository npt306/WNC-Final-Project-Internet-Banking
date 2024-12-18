import { Column, Entity, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Recipient extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  customer_id: string;

  @Column()
  account_number: string;

  @Column()
  nickname: string;

  @Column()
  bank: string;
}
