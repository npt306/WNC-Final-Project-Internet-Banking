import { Entity, Column, BaseEntity, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';
import { ApiProperty } from '@nestjs/swagger';
import { SupportedBank } from '../../../constants/supported-bank.enum'
import { AccountType } from '../../../constants/account-type.enum'
import { IsEnum } from 'class-validator';
@Entity()
export class Account extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @ApiProperty({
    example: '675db7c4cb2b0bf8ef4ffbf3',
    required: true,
  })
  @Column()
  customer_id: string;

  @ApiProperty({
    example: '112233445566',
    required: true,
  })
  @Column()
  account_number: string;

  @ApiProperty({
    example: AccountType.PAYMENT,
    required: true,
  })
  @IsEnum(AccountType)
  @Column()
  account_type: string;

  @ApiProperty({
    example: '10000000',
    required: true,
  })
  @Column()
  balance: number;

  @ApiProperty({
    example: SupportedBank.DEFAULT,
    required: true,
  })
  @Column()
  bank: string;
}
