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
import AppGateway from './socket/AppGetWay';
@Module({
  imports: [
    MongoModule,
    CustomerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthEmployeeModule,
    AuthCustomerModule,
    EmployeeModule,
    AccountModule,
    RecipientModule,
    DebtReminderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },],
})
export class AppModule {}
