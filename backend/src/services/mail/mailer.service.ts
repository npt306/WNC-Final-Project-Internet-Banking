import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { CustomerService } from '@/modules/customer/customer.service';
import { randomSequence } from '@/helpers/utils';
import { SendEmailCustomerDto } from '@/auth/auth_customer/dto/send-email.dto';
import { SendEmailDebtReminderDto } from '@/modules/debt-reminder/dto/send-email.dto';
import { PayDebtReminderDto } from '@/modules/debt-reminder/dto/pay-debt.dto';
import { DebtReminder } from '@/modules/debt-reminder/entities/debt-reminder.entity';
import { AccountService } from '@/modules/account/account.service';

@Injectable()
export class MailerCustomService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService
  ) {}

  async sendMailCustomer(sendEmailDto: SendEmailCustomerDto) {
    const {email, username} = sendEmailDto;
    const foundCustomer = await this.customerService.findByUsername(username);
    if (!foundCustomer || email !== foundCustomer.email) {
     throw new NotFoundException(`Customer not found`);
    }
    const customerInfo = await this.customerService.addCode(foundCustomer._id.toString());
    this.mailerService.sendMail({
      to: email, 
      subject: 'Change password of your account at Internet Banking System', // Subject line
      template: "change-password-mail",
      context: {
        name: username ,
        activationCode: customerInfo.code
      }
    })
    .then(() => console.log(`Send change password email to ${email}`)) 
    .catch((res) => console.log(res)) 
    return {
      _id: foundCustomer._id
    }
  }

  async sendMailDebtReminder(debtReminder: DebtReminder) {
    const creditorAccount = await this.accountService.findPaymentAccountByCustomerId(debtReminder.creditor);
    const debtorAccount = await this.accountService.findPaymentAccountByCustomerId(debtReminder.debtor);
    
    const creditorCustomer = await this.customerService.findById(debtReminder.creditor);
    const debtorCustomer = await this.customerService.findById(debtReminder.debtor);
    
    if (!debtorCustomer) {
     throw new NotFoundException(`Debtor not found`);
    }
    const debtorInfo = await this.customerService.addCode(debtorCustomer._id.toString());
    this.mailerService.sendMail({
      to: debtorCustomer.email, 
      subject: 'OTP code for transaction', // Subject line
      template: "pay-debt",
      context: {
        creditor: creditorCustomer,
        debtor: debtorCustomer,
        creditorAccountNumber: creditorAccount.account_number,
        codeOTP: debtorInfo.code,
        amount: debtReminder.amount,
        transferDate: debtReminder.createdAt
      }
    })
    .then(() => console.log(`Send paydebt OTP to ${debtorCustomer.email}`)) 
    .catch((res) => console.log(res)) 
    return {
      _id: debtorCustomer._id
    }
  }
}
