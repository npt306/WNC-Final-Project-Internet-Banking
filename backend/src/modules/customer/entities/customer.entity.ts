import { BaseEntity, Column, Entity, ObjectIdColumn, Unique, Index } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity()
@Unique(["username"])
export class Customer extends BaseEntity {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column()
    username: string;

    @Column()
    full_name: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refresh_token: string | null;

}


function Prop(): (target: Customer, propertyKey: "_id") => void {
    throw new Error('Function not implemented.');
}

