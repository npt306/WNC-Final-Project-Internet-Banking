import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDto } from './dto/transaction.dto';
import { DepositDto } from './dto/deposit.dto';
import { AccountService } from '../account/account.service';
import { TransferDto } from './dto/transfer.dto';

const TRANSFER_FEE = 0.02;

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) { }

  async create(transactionDto: TransactionDto): Promise<any> {
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
          $gte: thirtyDaysAgo,
        },
        // @ts-ignore
        $or: [{ sender: accountNumber }, { receiver: accountNumber }],
      },
    });
    return transactionList;
  }

  async transferTransactionHistory(accountNumber: string): Promise<Transaction[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactionList = await this.transactionRepository.find({
        where: {
          timestamp: {
            // @ts-ignore
            $gte: thirtyDaysAgo,
          },
          // @ts-ignore
          sender: accountNumber,
        },
        order: { timestamp: 'DESC' },
      });

      return transactionList;
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async receiverTransactionHistory(accountNumber: string): Promise<Transaction[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactionList = await this.transactionRepository.find({
        where: {
          timestamp: {
            // @ts-ignore
            $gte: thirtyDaysAgo,
          },
          // @ts-ignore
          receiver: accountNumber,
        },
        order: { timestamp: 'DESC' },
      });

      return transactionList;
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async debtPaymentTransactionHistory(accountNumber: string): Promise<Transaction[]> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const transactionList = await this.transactionRepository.find({
        where: {
          timestamp: {
            // @ts-ignore
            $gte: thirtyDaysAgo,
          },
          // @ts-ignore
          $or: [{ sender: accountNumber }, { receiver: accountNumber }],
          // @ts-ignore
          type: 'DEBT',
        },
        order: { timestamp: 'DESC' },
      });

      return transactionList;
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async allTransactionHistory(accountNumber: string): Promise<Transaction[]> {
    try {
      const transferTransactions = await this.transferTransactionHistory(accountNumber);
      const receiverTransactions = await this.receiverTransactionHistory(accountNumber);
      const debtPaymentTransactions = await this.debtPaymentTransactionHistory(accountNumber);

      const allTransactions = [
        ...transferTransactions,
        ...receiverTransactions,
        ...debtPaymentTransactions,
      ];

      allTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return allTransactions;
    } catch (error) {
      throw new Error(`Failed to fetch all transaction history: ${error.message}`);
    }
  }

  async getListForChecking(
    bank?: string,
    from?: Date,
    to?: Date,
  ): Promise<{ transactions: Transaction[], totalAmount: number }> {
    let whereCondition: any = {
      type: 'TRANSFER',
    };
    if (bank && typeof bank === 'string' && bank.trim() !== '') {
      console.log(bank);
      whereCondition.$or = [{ sender_bank: bank }, { receiver_bank: bank }];
    }
    const transactions = await this.transactionRepository.find({ where: whereCondition });

    const totalAmount = transactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0); // Nếu transaction.amount là undefined, cộng vào 0
    }, 0);

    return { transactions, totalAmount };
  }

  

  async deposit(depositDto: DepositDto): Promise<any> {
    const thisAccount = await this.accountService.findAccountByAccountNumber(
      depositDto.receiver,
    );

    thisAccount.balance += depositDto.amount;
    this.accountService.updateUserAccount(
      thisAccount._id.toString(),
      thisAccount,
    );

    depositDto.receiver_balance = thisAccount.balance;
    const result = await this.create(depositDto);
    return result;
  }

  async transfer(transferDto: TransferDto): Promise<any> {
    let amount = transferDto.amount;

    // Get current balances
    const senderAccount = await this.accountService.findAccountByAccountNumber(
      transferDto.sender,
    );
    let senderNewBalance = senderAccount.balance - amount;

    const receiverAccount =
      await this.accountService.findAccountByAccountNumber(
        transferDto.receiver,
      );
    let receiverNewBalance = receiverAccount.balance + amount;

    // Fee handling
    if (transferDto.payer) {
      transferDto.fee = amount * TRANSFER_FEE; // 2%

      if (transferDto.payer == transferDto.sender) {
        senderNewBalance -= transferDto.fee;
      } else {
        receiverNewBalance -= transferDto.fee;
      }
    }

    // Checking balance for case sender pay the fee,
    // the only case would make the balance drop below zero
    if (senderNewBalance < 0) {
      throw new BadRequestException('Sender does not have enough balance');
    }

    // Update sender's balance
    senderAccount.balance = senderNewBalance;
    transferDto.sender_balance = senderNewBalance;
    this.accountService.updateUserAccount(
      senderAccount._id.toString(),
      senderAccount,
    );

    // Update receiver's balance
    receiverAccount.balance = receiverNewBalance;
    transferDto.receiver_balance = receiverNewBalance;
    this.accountService.updateUserAccount(
      receiverAccount._id.toString(),
      receiverAccount,
    );

    // Save log
    const result = await this.transactionRepository.create(transferDto);
    return result;
  }
}
