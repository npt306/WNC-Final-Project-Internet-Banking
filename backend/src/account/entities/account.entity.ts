import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
@Entity()
export class Account extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId;
    
    @Column()
    customer_id: string;

    @Column()
    account_number: string;

    @Column()
    account_type: string;

    @Column()
    balance: number;

    @Column()
    bank: string;

}
