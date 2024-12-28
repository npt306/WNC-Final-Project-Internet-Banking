import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/modules/customer/customer.service';
import { ObjectId } from 'mongodb';
import { NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { TransactionService } from '../transaction/transaction.services';
import { DepositDto } from '../transaction/dto/deposit.dto';
import { TransferDto } from '../transaction/dto/transfer.dto';
import { Customer } from '../customer/entities/customer.entity';
import { DebtDto } from '../transaction/dto/debt.dto';

const TRANSFER_FEE = 0.02;

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
  ) { }

  private async generateUniqueAccountNumber(): Promise<string> {
    let accountNumber: string;

    do {
      accountNumber = Math.floor(
        1000000000 + Math.random() * 9000000000,
      ).toString(); // 10 digits
    } while (
      await this.accountRepository.findOneBy({
        account_number: accountNumber,
        bank: 'default',
      })
    );

    return accountNumber;
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    await this.customerService.findOne(createAccountDto.customer_id);

    const newAccount = this.accountRepository.create({
      ...createAccountDto,
      account_number: await this.generateUniqueAccountNumber(),
    });
    return await this.accountRepository.save(newAccount);
  }

  async findAll() {
    return await this.accountRepository.find();
  }

  async findAccountsUser(id: string): Promise<Account[]> {
    await this.customerService.findOne(id);

    const accounts = await this.accountRepository.find({
      where: { customer_id: id },
    });
    return accounts;
  }

  async findCustomerByAccountNumber(accountNumber: string): Promise<any> {
    const account = await this.accountRepository.findOneBy({
      account_number: accountNumber,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }
    const customer = await this.customerService.findOne(account.customer_id);
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    const { password, refresh_token,phone, email, ...filteredCustomer } = customer;
    return filteredCustomer;
  }

  async findOneAccount(id: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      _id: new ObjectId(id),
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }
    return account;
  }

  async findAccountByAccountNumber(accountNumber: string): Promise<Account> {
    const account = await this.accountRepository.findOneBy({
      account_number: accountNumber,
    });
    if (!account) {
      throw new NotFoundException(`Account not found`);
    }
    return account;
  }

  async updateUserAccount(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    await this.customerService.findOne(updateAccountDto.customer_id);
    await this.findOneAccount(id);

    await this.accountRepository.update(
      { _id: new ObjectId(id) },
      updateAccountDto,
    );
    return await this.findOneAccount(id);
  }

  async removeAccount(id: string): Promise<Account> {
    const removeAccount = await this.findOneAccount(id);
    if (
      removeAccount.account_type === 'payment' &&
      removeAccount.bank === 'default'
    ) {
      throw new ConflictException('Cannot default delete payment account');
    }
    await this.accountRepository.delete({ _id: new ObjectId(id) });
    return removeAccount;
  }

  async deposit(depositDto: DepositDto): Promise<any> {
    const thisAccount = await this.findAccountByAccountNumber(depositDto.receiver);

    thisAccount.balance += depositDto.amount;
    this.accountRepository.save(thisAccount);

    depositDto.receiver_balance = thisAccount.balance;
    const result = this.transactionService.create(depositDto);
    return result;
  }

  private isTransferDto(transferDto: TransferDto | DebtDto): transferDto is TransferDto {
    return (transferDto as TransferDto).payer !== undefined;
  }

  async transfer(transferDto: TransferDto | DebtDto): Promise<any> {
    let amount = transferDto.amount;

    // Get current balances
    const senderAccount = await this.findAccountByAccountNumber(transferDto.sender);
    let senderNewBalance = senderAccount.balance - amount;

    const receiverAccount = await this.findAccountByAccountNumber(transferDto.receiver);
    let receiverNewBalance = receiverAccount.balance + amount;

    // Fee handling
    if (this.isTransferDto(transferDto)) {      
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
      throw new BadRequestException("Sender does not have enough balance");
    }

    // Update sender's balance
    senderAccount.balance = senderNewBalance;
    transferDto.sender_balance = senderNewBalance;
    this.accountRepository.save(senderAccount);

    // Update receiver's balance
    receiverAccount.balance = receiverNewBalance;
    transferDto.receiver_balance = receiverNewBalance;
    this.accountRepository.save(receiverAccount);

    // Save log
    const result = await this.transactionService.create(transferDto);
    return result;
  }
}
