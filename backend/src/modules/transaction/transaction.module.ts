import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.services';
import { MongoModule } from '@/databases/mongo.module';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    MongoModule,
    TypeOrmModule.forFeature([Transaction]),
    forwardRef(() => AccountModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
