import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDto } from './dto/transaction.dto';
import { DepositDto } from './dto/deposit.dto';
import { AccountService } from '../account/account.service';
import { TransferLogDto } from './dto/transfer_log.dto';
import { TransferDto } from './dto/transfer.dto';
import { AxiosService } from '@/axios/axios.service';
import { SupportedBank } from '@/constants/supported-bank.enum';
import { TransactionType } from '@/constants/transaction-type.enum';

const TRANSFER_FEE = 0.02;

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => AxiosService))
    private readonly axiosService: AxiosService,
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
          type: { $ne: TransactionType.DEBT },
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
          type: { $ne: TransactionType.DEBT },
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
          type: TransactionType.DEBT,
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
            return { ...transaction, customerSide: 'PAYER' };
          } else if (transaction.receiver === accountNumber) {
            return { ...transaction, customerSide: 'PAYEE' };
          }
          return transaction;
        },
      );

      const allTransactions = [
        ...transferTransactions.map((transaction) => ({
          ...transaction,
          customerSide: 'SENDER',
        })),
        ...receiverTransactions.map((transaction) => ({
          ...transaction,
          customerSide: 'RECEIVER',
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
      type: TransactionType.TRANSFER,
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
        type: TransactionType.TRANSFER,
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
    transferDto.fee = amount * TRANSFER_FEE; // 2%

    if (transferDto.payer == transferDto.sender) {
      senderNewBalance -= transferDto.fee;
    } else {
      receiverNewBalance -= transferDto.fee;
    }

    // Checking balance for case sender pay the fee,
    // the only case would make the balance drop below zero
    if (senderNewBalance < 0) {
      throw new BadRequestException('Sender does not have enough balance');
    }

    // Update sender's balance
    senderAccount.balance = senderNewBalance;
    this.accountService.updateUserAccount(
      senderAccount._id.toString(),
      senderAccount,
    );

    // Update receiver's balance
    receiverAccount.balance = receiverNewBalance;
    this.accountService.updateUserAccount(
      receiverAccount._id.toString(),
      receiverAccount,
    );

    const transferLogDto: TransferLogDto = {
      ...transferDto,
      sender_balance: senderNewBalance,
      receiver_balance: receiverNewBalance,
    };

    // Save log
    const result = await this.create(transferLogDto);
    return result;
  }

  async externalTransfer(transferDto: TransferDto) {
    let amount = transferDto.amount;
    let senderNewBalance = null;
    let receiverNewBalance = null;
    // Fee handling
    transferDto.fee = amount * TRANSFER_FEE; // 2%

    if (transferDto.sender_bank == SupportedBank.DEFAULT) {
      // SEND transfer
      // Apply fee
      if (transferDto.payer == transferDto.sender) {
        senderNewBalance -= transferDto.fee;
      }
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

      // Handle result
      let result = await this.axiosService.postTransferMoney(transferDto);
      console.log('RECEIVE result');
      console.log(result);
      if (result.statusCode !== 200) {
        return result;
      }

      // Update sender's balance
      senderAccount.balance = senderNewBalance;
      this.accountService.updateUserAccount(
        senderAccount._id.toString(),
        senderAccount,
      );
    } else {
      // RECEIVE transfer
      // Apply fee
      if (transferDto.payer == transferDto.receiver) {
        receiverNewBalance -= transferDto.fee;
      }

      // Get current balances
      const receiverAccount =
        await this.accountService.findAccountByAccountNumber(
          transferDto.receiver,
        );
      receiverNewBalance = receiverAccount.balance + amount;

      // Update receiver's balance
      receiverAccount.balance = receiverNewBalance;
    }

    const transferLogDto: TransferLogDto = {
      ...transferDto,
      sender_balance: senderNewBalance,
      receiver_balance: receiverNewBalance,
    };

    // Save log
    const result = await this.create(transferLogDto);
    return result;
  }
}
