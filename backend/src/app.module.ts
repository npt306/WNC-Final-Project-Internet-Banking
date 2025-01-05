import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthCustomerModule } from '@/auth/auth_customer/auth_customer.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './modules/employee/employee.module';
import { AccountModule } from './modules/account/account.module';
import { MongoModule } from './databases/mongo.module';
import { RecipientModule } from './modules/recipient/recipient.module';
import { DebtReminderModule } from './modules/debt-reminder/debt-reminder.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/transform.interceptor';
import { AuthEmployeeModule } from './auth/auth_employee/auth_employee.module';
import { AuthAdminModule } from './auth/auth_admin/auth_admin.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ExternalModule } from './modules/external/external.module';
import { MailerCustomModule } from './services/mail/mailer.module';
import { PgpModule } from './services/pgp/pgp.module';
import { AxiosModule } from './axios/axios.module';
import { DebtReminderNotificationModule } from './modules/debt-reminder-notification/debt-reminder-notification.module';
import AppGateway from './modules/debt-reminder-notification/socket/AppGetWay';
import { RsaModule } from './services/rsa/rsa.module';
@Module({
  imports: [
    MongoModule,
    CustomerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthEmployeeModule,
    AuthAdminModule,
    AuthCustomerModule,
    EmployeeModule,
    AccountModule,
    RecipientModule,
    TransactionModule,
    DebtReminderModule,
    DebtReminderNotificationModule,
    PgpModule,
    RsaModule,
    AxiosModule,
    ExternalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
