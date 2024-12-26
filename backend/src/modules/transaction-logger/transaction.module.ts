import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.services';
import { MongoModule } from '@/databases/mongo.module';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [MongoModule, TypeOrmModule.forFeature([Transaction])],
  controllers: [],
  providers: [TransactionService],
})
export class TransactionModule {}
