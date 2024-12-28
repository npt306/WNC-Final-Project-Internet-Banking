import { Injectable } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
