import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupportedBank, TransactionDto } from './dto/transaction.dto';
import { DepositDto } from './dto/deposit.dto';
import { AccountService } from '../account/account.service';
import { TransferLogDto } from './dto/transfer_log.dto';

const TRANSFER_FEE = 0.02;
const OURBANK = 'Sankcomba';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

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

  async transferTransactionHistory(
    accountNumber: string,
  ): Promise<Transaction[]> {
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
          // @ts-ignore
          type: { $ne: 'DEBT' },
        },
        order: { timestamp: 'DESC' },
      });

      return transactionList;
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async receiverTransactionHistory(
    accountNumber: string,
  ): Promise<Transaction[]> {
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
          // @ts-ignore
          type: { $ne: 'DEBT' },
        },
        order: { timestamp: 'DESC' },
      });

      return transactionList;
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async debtPaymentTransactionHistory(
    accountNumber: string,
  ): Promise<Transaction[]> {
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

  async allTransactionHistory(accountNumber: string): Promise<any> {
    try {
      const transferTransactions =
        await this.transferTransactionHistory(accountNumber);
      const receiverTransactions =
        await this.receiverTransactionHistory(accountNumber);
      const debtPaymentTransactions =
        await this.debtPaymentTransactionHistory(accountNumber);

      const updatedDebtPaymentTransactions = debtPaymentTransactions.map(
        (transaction) => {
          if (transaction.sender === accountNumber) {
            return { ...transaction, customerSide: 'payer' };
          } else if (transaction.receiver === accountNumber) {
            return { ...transaction, customerSide: 'payee' };
          }
          return transaction;
        },
      );

      const allTransactions = [
        ...transferTransactions.map((transaction) => ({
          ...transaction,
          customerSide: 'sender',
        })),
        ...receiverTransactions.map((transaction) => ({
          ...transaction,
          customerSide: 'receiver',
        })),
        ...updatedDebtPaymentTransactions,
      ];

      allTransactions.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
      );

      return allTransactions;
    } catch (error) {
      throw new Error(
        `Failed to fetch all transaction history: ${error.message}`,
      );
    }
  }

  async getListForChecking(
    bank?: string,
    from?: Date,
    to?: Date,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }> {
    let whereCondition: any = {
      type: 'TRANSFER',
    };
    if (bank && typeof bank === 'string' && bank.trim() !== '') {
      console.log(bank);
      whereCondition.$or = [{ sender_bank: bank }, { receiver_bank: bank }];
    }
    const transactions = await this.transactionRepository.find({
      where: whereCondition,
    });

    const totalAmount = transactions.reduce((sum, transaction) => {
      return sum + (transaction.amount || 0); // Nếu transaction.amount là undefined, cộng vào 0
    }, 0);

    return { transactions, totalAmount };
  }

  async getListForCheckingAllBanks(
    from?: Date,
    to?: Date,
  ): Promise<{ transactions: Transaction[]; totalAmount: number }> {
    try {
      // Parse from/to thành Date
      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;

      let whereCondition: any = {
        type: 'TRANSFER',
        sender_bank: { $exists: true, $ne: null },
        receiver_bank: { $exists: true, $ne: null },
      };

      // Thêm điều kiện timestamp nếu from/to tồn tại
      if (fromDate || toDate) {
        whereCondition.timestamp = {};
        if (fromDate) whereCondition.timestamp.$gte = fromDate;
        if (toDate) whereCondition.timestamp.$lte = toDate;
      }

      // Lấy danh sách giao dịch
      const transactions = await this.transactionRepository.find({
        where: whereCondition,
        order: { timestamp: 'DESC' },
      });

      // Tính tổng số tiền giao dịch
      const totalAmount = transactions.reduce((sum, transaction) => {
        return sum + (transaction.amount || 0);
      }, 0);

      return { transactions, totalAmount };
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
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

  async transfer(transferDto: TransferLogDto): Promise<any> {
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
    const result = await this.create(transferDto);
    return result;
  }

  async externalTransfer(transferDto: TransferLogDto) {
    let amount = transferDto.amount;
    let senderNewBalance = 0;
    let receiverNewBalance = 0;

    if (transferDto.sender_bank == SupportedBank.ThisBank) {
      // Get current balances
      const senderAccount =
        await this.accountService.findAccountByAccountNumber(
          transferDto.sender,
        );
      senderNewBalance = senderAccount.balance - amount;

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
    } else {
      // Get current balances
      const receiverAccount =
        await this.accountService.findAccountByAccountNumber(
          transferDto.receiver,
        );
      receiverNewBalance = receiverAccount.balance + amount;

      // Update receiver's balance
      receiverAccount.balance = receiverNewBalance;
      transferDto.receiver_balance = receiverNewBalance;
      this.accountService.updateUserAccount(
        receiverAccount._id.toString(),
        receiverAccount,
      );
    }

    // Save log
    const result = await this.create(transferDto);
    return result.statusCode;
  }
}
