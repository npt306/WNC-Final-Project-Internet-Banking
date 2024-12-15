import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomerModule } from './customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { AccountModule } from './account/account.module';
import { MongoModule } from './databases/mongo.module';
import { RecipientModule } from './recipient/recipient.module';
import { DebtReminderModule } from './debt-reminder/debt-reminder.module';

@Module({
  imports: [
    MongoModule,
    CustomerModule,
    ConfigModule.forRoot(),
    EmployeeModule,
    AccountModule,
    RecipientModule,
    DebtReminderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
