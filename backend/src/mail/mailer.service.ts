import { SendEmailDto } from './../auth/auth_customer/dto/send-email.dto';
import { ChangePasswordDto } from './../auth/auth_customer/dto/change-password.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { CustomerService } from '@/modules/customer/customer.service';
import { randomSequence } from '@/helpers/utils';

@Injectable()
export class MailerCustomService {
  constructor(
    private readonly mailerService: NestMailerService,
    private customerService: CustomerService,
  ) {}

  async sendMailCustomer(sendEmailDto: SendEmailDto) {
    const {email, username} = sendEmailDto;
    const foundCustomer = await this.customerService.findByUsername(username);
    if (!foundCustomer || email !== foundCustomer.email) {
     throw new NotFoundException(`Customer not found`);
    }
    const customerInfo = await this.customerService.addResetPasswordCode(foundCustomer._id.toString());
    this.mailerService.sendMail({
      to: email, 
      subject: 'Change password of your account at Internet Banking System', // Subject line
      template: "change-password-mail",
      context: {
        name: username ,
        activationCode: customerInfo.resetPasswordCode
      }
    })
    .then(() => console.log(`Send change password email to ${email}`)) 
    .catch((res) => console.log(res)) 
    return {
      _id: foundCustomer._id
    }
  }
}
