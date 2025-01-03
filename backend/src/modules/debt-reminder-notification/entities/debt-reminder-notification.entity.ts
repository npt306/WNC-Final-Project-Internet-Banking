import { Entity, ObjectIdColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('debt-reminder-notification')
export class DebtReminderNotification {
    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    customer_id: string;

    @Column()
    title: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;
}
