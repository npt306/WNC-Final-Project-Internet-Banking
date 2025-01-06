import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/modules/customer/customer.service';
import { ObjectId } from 'mongodb';
import { NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { Customer } from '../customer/entities/customer.entity';
import { UpdateBalanceDto } from './dto/update-balance.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => CustomerService))
    private readonly customerService: CustomerService,
  ) {}

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
    const accounts = await this.accountRepository.find();

    // Map qua từng account để lấy thêm thông tin customer
    const accountsWithCustomerInfo = await Promise.all(
      accounts.map(async (account) => {
        const customer = await this.customerService.findOne(
          account.customer_id,
        );

        return {
          ...account,
          username: customer.username,
          full_name: customer.full_name,
          email: customer.email,
        };
      }),
    );

    return accountsWithCustomerInfo;
  }

  async findPaymentAccountByCustomerId(id: string): Promise<Account> {
    await this.customerService.findOne(id);

    const account = await this.accountRepository.findOneBy({
      customer_id: id,
      account_type: 'payment',
    });

    if (!account) {
      throw new NotFoundException(`Payment account not found `);
    }

    return account;
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
    return customer;
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

  async updateBalance(updateBalanceDto: UpdateBalanceDto): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { account_number: updateBalanceDto.account_number },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.accountRepository.update(
      { account_number: updateBalanceDto.account_number },
      { balance: updateBalanceDto.balance },
    );

    return await this.accountRepository.findOne({
      where: { account_number: updateBalanceDto.account_number },
    });
  }
}
