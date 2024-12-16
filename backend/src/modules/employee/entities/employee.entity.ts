import { Entity, Column, ObjectIdColumn, BaseEntity } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
export class Employee extends BaseEntity{
    @ObjectIdColumn()
    _id?: ObjectId;
    
    @Column()
    username: string;

    @Column()
    full_name: string;
    
    @Column()
    email: string;
    
    @Column()
    password: string;

    @Column({ nullable: true })
    refresh_token: string | null;
}
