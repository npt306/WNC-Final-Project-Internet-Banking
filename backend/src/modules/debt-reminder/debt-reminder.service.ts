import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class DebtReminderService {
  constructor(
    @InjectRepository(DebtReminder)
    private debtReminderRepository: Repository<DebtReminder>,
    private readonly debtReminderNotificationService: DebtReminderNotificationService,
    private readonly accountService: AccountService,
    private readonly customerService: CustomerService,
    private readonly transactionService: TransactionService,
  ) {}

  async create(
    createDebtReminderDto: CreateDebtReminderDto,
  ): Promise<DebtReminder> {
    const newDebtReminder = this.debtReminderRepository.create(
      createDebtReminderDto,
    );
    await this.debtReminderNotificationService.sendNotification(
      newDebtReminder.debtor,
      'Debt reminder',
      `You have a new debt reminder from ${newDebtReminder.creditor}`,
    );
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

  async findSendDebtReminder(id: string): Promise<DebtReminder[]> {
    return await this.debtReminderRepository.find({ where: { creditor: id } });
  }

  async findReceivedDebtReminder(id: string): Promise<DebtReminder[]> {
    return await this.debtReminderRepository.find({ where: { debtor: id } });
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

  async payDebt(id: string): Promise<DebtReminder> {
    const debtReminder = await this.findOneDebtReminder(id);
  
    const creditorAccount = await this.accountService.findPaymentAccountByCustomerId(debtReminder.creditor);
    const creditorAccountNumber = creditorAccount.account_number;

    const debtorAccount = await this.accountService.findPaymentAccountByCustomerId(debtReminder.debtor);
    const debtorAccountNumber = debtorAccount.account_number;
    
    const debtorCustomer = await this.customerService.findById(debtReminder.debtor);

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
    }
    else {
      throw new BadRequestException(`Paid debt failed`);
    }

    return await this.findOneDebtReminder(id);
  }
}
