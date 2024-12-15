import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('debt-reminder')
export class DebtReminder extends BaseEntity {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    creditor: string; 

    @Column()
    debtor: string; 

    @Column()
    amount: number; 

    @Column()
    message: string; 

    @Column()
    createdAt: Date; 

    @Column()
    status: string; 
}
