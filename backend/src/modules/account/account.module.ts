import { Module, forwardRef } from '@nestjs/common';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { AccountController } from './account.controller';
import { CustomerModule } from 'src/modules/customer/customer.module';
import { TransactionModule } from '../transaction/transaction.module';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransactionService } from '../transaction/transaction.services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Transaction]),
    forwardRef(() => CustomerModule),
    TransactionModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, TransactionService],
  exports: [AccountService],
})
export class AccountModule {}
