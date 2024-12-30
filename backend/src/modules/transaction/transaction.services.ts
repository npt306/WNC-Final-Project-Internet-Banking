import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { TransactionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(transactionDto: TransactionDto): Promise<Transaction> {
    const newTransaction = this.transactionRepository.create({
      ...transactionDto,
    });

    return await this.transactionRepository.save(newTransaction);
  }

  async getList(accountNumber: string): Promise<Transaction[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactionList = await this.transactionRepository.find({
      where: { 
        timestamp: { 
          // @ts-ignore
          $gte: thirtyDaysAgo 
        },
        // @ts-ignore
        $or: [
          {sender: accountNumber},
          {receiver:accountNumber}
        ]
      }
    });
    return transactionList;
  }
}
