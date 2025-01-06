import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateDebtReminderDto } from './dto/create-debt-reminder.dto';
import { UpdateDebtReminderDto } from './dto/update-debt-reminder.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtReminder } from './entities/debt-reminder.entity';
import { ObjectId } from 'mongodb';
import { DebtReminderNotificationService } from '../debt-reminder-notification/debt-reminder-notification.service';
import { AccountService } from '../account/account.service';
import { TransactionService } from '../transaction/transaction.services';
import { CustomerService } from '../customer/customer.service';
import { PayDebtReminderDto } from './dto/pay-debt.dto';
import { SendEmailDebtReminderDto } from './dto/send-email.dto';
import { MailerCustomService } from '@/services/mail/mailer.service';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class DebtReminderService {
  constructor(
    @InjectRepository(DebtReminder)
    private debtReminderRepository: Repository<DebtReminder>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly debtReminderNotificationService: DebtReminderNotificationService,
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly transactionService: TransactionService,
    private readonly mailCustomService: MailerCustomService
  ) {}

  async create(
    createDebtReminderDto: CreateDebtReminderDto,
  ): Promise<DebtReminder> {
    // Validate if creditor and debtor exist
    const creditor = await this.customerRepository.findOne({
      where: { _id: new ObjectId(createDebtReminderDto.creditor) },
    });
    const debtor = await this.customerRepository.findOne({
      where: { _id: new ObjectId(createDebtReminderDto.debtor) },
    });

    if (!creditor || !debtor) {
      throw new NotFoundException('Creditor or Debtor not found');
    }

    const newDebtReminder = this.debtReminderRepository.create({
      ...createDebtReminderDto,
      createdAt: new Date(),
      status: 'Pending',
    });

    return await this.debtReminderRepository.save(newDebtReminder);
  }

  async findAll(): Promise<DebtReminder[]> {
    return await this.debtReminderRepository.find();
  }

  async findOne(id: string): Promise<DebtReminder> {
    return await this.debtReminderRepository.findOneBy({
      _id: new ObjectId(id),
    });
  }

  async findOneDebtReminder(id: string): Promise<DebtReminder> {
    const objectId = new ObjectId(id);
    const debtReminder = await this.debtReminderRepository.findOneBy({
      _id: objectId,
    });
    if (!debtReminder) {
      throw new NotFoundException(`Debt reminder not found`);
    }
    return debtReminder;
  }

  async findSendDebtReminder(id: string): Promise<any[]> {
    const debtReminders = await this.debtReminderRepository.find({
      where: { creditor: id },
    });

    // Lấy thông tin debtor từ bảng customer
    const result = await Promise.all(
      debtReminders.map(async (reminder) => {
        const debtor = await this.customerRepository.findOne({
          where: { _id: new ObjectId(reminder.debtor) },
          select: ['full_name'],
        });
        return {
          ...reminder,
          debtor_name: debtor?.full_name,
        };
      }),
    );

    return result;
  }

  async findReceivedDebtReminder(id: string): Promise<any[]> {
    const debtReminders = await this.debtReminderRepository.find({
      where: { debtor: id },
    });

    // Lấy thông tin creditor từ bảng customer
    const result = await Promise.all(
      debtReminders.map(async (reminder) => {
        const creditor = await this.customerRepository.findOne({
          where: { _id: new ObjectId(reminder.creditor) },
          select: ['full_name'],
        });
        return {
          ...reminder,
          creditor_name: creditor?.full_name,
        };
      }),
    );

    return result;
  }

  async update(
    id: string,
    updateDebtReminderDto: UpdateDebtReminderDto,
  ): Promise<DebtReminder> {
    await this.findOneDebtReminder(id);
    await this.debtReminderRepository.update(
      { _id: new ObjectId(id) },
      updateDebtReminderDto,
    );
    return this.findOneDebtReminder(id);
  }

  async remove(id: string): Promise<DebtReminder> {
    const debtReminderRemove = await this.findOneDebtReminder(id);
    await this.debtReminderRepository.delete({ _id: new ObjectId(id) });
    return debtReminderRemove;
  }

  async payDebt(payDebtReminderDto: PayDebtReminderDto): Promise<DebtReminder> {
    const {_id, codeOTP} = payDebtReminderDto;

    const debtReminder = await this.findOneDebtReminder(_id);
  
    const creditorAccount = await this.accountService.findPaymentAccountByCustomerId(debtReminder.creditor);
    const creditorAccountNumber = creditorAccount.account_number;

    const debtorAccount =
      await this.accountService.findPaymentAccountByCustomerId(
        debtReminder.debtor,
      );
    const debtorAccountNumber = debtorAccount.account_number;
    
    const debtorCustomer = await this.customerService.findById(debtReminder.debtor);
    if(codeOTP !== debtorCustomer.code) {
      throw new BadRequestException("Wrong reset code !!!");
    }

    const transaction = await this.transactionService.transfer({
      sender: debtorAccountNumber,
      receiver: creditorAccountNumber,
      amount: debtReminder.amount,
      content: debtorCustomer.full_name + ' have paid the debt.',
      fee: 2000,
      payer: debtorAccountNumber,
      type: 'DEBT',
      timestamp: new Date(),
    });

    if (transaction) {
      debtReminder.status = 'Completed';
      await this.debtReminderRepository.save(debtReminder);
    } else {
      throw new BadRequestException(`Paid debt failed`);
    }
    this.customerService.removeCode(debtorCustomer._id.toString())

    return await this.findOneDebtReminder(_id);
  }

  async sendPayDebtReminderEmail(_id: string) {
    const debtReminder = await this.findOneDebtReminder(_id);

    if(debtReminder.status === 'Completed') {
      throw new BadRequestException("Debt have already been paid");
    }
    this.mailCustomService.sendMailDebtReminder(debtReminder);
  }
}
