import { Module } from '@nestjs/common';
import { RecipientService } from './recipient.service';
import { RecipientController } from './recipient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipient } from './entities/recipient.entity';
import { HttpModule } from '@nestjs/axios';
import { AccountModule } from '../account/account.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Recipient]),
    AccountModule,
    CustomerModule,
    HttpModule,
  ],
  controllers: [RecipientController],
  providers: [RecipientService],
})
export class RecipientModule {}
