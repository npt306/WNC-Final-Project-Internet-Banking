import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipientDto } from './dto/create-recipient.dto';
import { UpdateRecipientDto } from './dto/update-recipient.dto';
import { Recipient } from './entities/recipient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';

@Injectable()
export class RecipientService {
  constructor(
    @InjectRepository(Recipient)
    private recipientRepository: Repository<Recipient>,
  ) { }
  async create(createRecipientDto: CreateRecipientDto): Promise<Recipient> {
    const newRecipient = this.recipientRepository.create(createRecipientDto);
    return await this.recipientRepository.save(newRecipient);
  }

  async findAll(): Promise<Recipient[]> {
    return await this.recipientRepository.find();
  }

  async findCustomerRecipient(id: string): Promise<Recipient[]> {

    const recipients = await this.recipientRepository.find({ where: { customer_id: id } });
    return recipients;
  }

  async update(id: string, updateRecipientDto: UpdateRecipientDto): Promise<Recipient> {
    const recipient = await this.recipientRepository.findOne({ where: { _id: new ObjectId(id) } });
    if (!recipient) {
      throw new NotFoundException(`Recipient not found`);
    }
    await this.recipientRepository.update({ _id: new ObjectId(id) }, updateRecipientDto);
    return await this.recipientRepository.findOne({ where: { _id: new ObjectId(id) } });  
  }

  async remove(id: string): Promise<Recipient> {
    const recipient = await this.recipientRepository.findOne({ where: { _id: new ObjectId(id) } });
    if (!recipient) {
      throw new NotFoundException(`Recipient not found`);
    }
    await this.recipientRepository.delete({ _id: new ObjectId(id) });
    return recipient;
  }
}
