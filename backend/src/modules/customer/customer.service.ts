import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { ObjectId } from 'mongodb';
import { ConflictException } from '@nestjs/common';
import { AccountService } from 'src/modules/account/account.service';
import { comparePasswordHelper, hashPasswordHelper } from '@/helpers/utils';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
  ) {}

  async findByUsername(username: string) {
    return await this.customerRepository.findOneBy({ username: username });
  }

  async findById(id: string) {
    return await this.customerRepository.findOneBy({ _id: new ObjectId(id) });
  }

  async validateUser(username: string, pass: string) {
    const user = await this.customerRepository.findOneBy({ username: username });
    if(!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);
  
    if(!user || !isValidPassword) return null;
    return user;
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    if (
      await this.customerRepository.findOneBy({
        username: createCustomerDto.username,
      })
    ) {
      throw new ConflictException('Username already exists');
    }
    const hashedPassword = await hashPasswordHelper(createCustomerDto.password);

    const newCustomer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword
    });
    const savedCustomer = await this.customerRepository.save(newCustomer);
    try {
      await this.accountService.createAccount({
        customer_id: savedCustomer._id.toString(),
        balance: 0,
        bank: 'default',
        account_type: 'payment',
        account_number: 'none',
      });
    } catch (error) {
      await this.customerRepository.delete({ _id: savedCustomer._id });
      throw error;
    }

    return savedCustomer;
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: string): Promise<Customer | null> {
    const objectId = new ObjectId(id);
    const customer = await this.customerRepository.findOneBy({ _id: objectId });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }
    return customer;
  }
  

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const objectId = new ObjectId(id);
    const customer = await this.customerRepository.findOneBy({ _id: objectId });
    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    await this.customerRepository.update({ _id: objectId }, updateCustomerDto);
    const updatedCustomer = await this.customerRepository.findOneBy({
      _id: objectId,
    });

    return updatedCustomer;
  }

  async remove(id: string): Promise<Customer> {
    const objectId = new ObjectId(id);
    const customer = await this.customerRepository.findOneBy({ _id: objectId });

    if (!customer) {
      throw new NotFoundException(`Customer not found`);
    }

    await this.customerRepository.delete({ _id: objectId });
    return customer;
  }
}
