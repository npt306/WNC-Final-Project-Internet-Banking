import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './entities/recipient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { AccountService } from 'src/account/account.service';
import { CustomerService } from 'src/customer/customer.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private httpService: HttpService,
  ) { }

  private async getNameFromBankA(accountNumber: string): Promise<any> {
    const apiUrl = `https://bank-a.com/api/user/${accountNumber}`;
    try {
      const response = await lastValueFrom(this.httpService.get(apiUrl));
      return response.data.name;
    } catch (error) {
      throw new Error('Cannot get name from bank A');
    }
  }

  private async getNameFromBankB(accountNumber: string): Promise<any> {
    const apiUrl = `https://bank-b.com/api/user/${accountNumber}`;
    try {
      const response = await lastValueFrom(this.httpService.get(apiUrl));
      return response.data.name;
    } catch (error) {
      throw new Error('Cannot get name from bank B');
    }
  }

  private async getUserInfoFromLinkedBank(linkedBank: string, accountNumber: string): Promise<any> {

    switch (linkedBank) {
      case '1':
        return await this.getNameFromBankA(accountNumber);
      case '2':
        return await this.getNameFromBankB(accountNumber);
      default:
        throw new Error('Invalid linked bank');
    }

  }

  async create(createRecipientDto: CreateRecipientDto): Promise<Recipient> {
    const { nickname, bank, account_number } = createRecipientDto;

    // When nickname is not provided, we will get the name from the bank
    if (!nickname) {
      if (bank === 'default') {
        const { customer_id } = await this.accountService.findAccountByAccountNumber(account_number);
        const { full_name } = await this.customerService.findOne(customer_id);
        createRecipientDto.nickname = full_name;
      } else {
        const full_name = await this.getUserInfoFromLinkedBank(bank, createRecipientDto.account_number);
        createRecipientDto.nickname = full_name;
        if (!full_name) {
          throw new Error('Cannot get username from bank');
        }
      } 
    }
    const newRecipient = this.recipientRepository.create(createRecipientDto);
    return await this.recipientRepository.save(newRecipient);
  }


  async findAll(): Promise<Recipient[]> {
    return await this.recipientRepository.find();
  }

  async findCustomerRecipient(id: string): Promise<Recipient[]> {
    const recipients = await this.recipientRepository.find({
      where: { customer_id: id },
    });
    return recipients;
  }

  async update(
    id: string,
    updateRecipientDto: UpdateRecipientDto,
  ): Promise<Recipient> {
    const recipient = await this.recipientRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!recipient) {
      throw new NotFoundException(`Recipient not found`);
    }
    await this.recipientRepository.update(
      { _id: new ObjectId(id) },
      updateRecipientDto,
    );
    return await this.recipientRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }

  async remove(id: string): Promise<Recipient> {
    const recipient = await this.recipientRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!recipient) {
      throw new NotFoundException(`Recipient not found`);
    }
    await this.recipientRepository.delete({ _id: new ObjectId(id) });
    return recipient;
  }
}
