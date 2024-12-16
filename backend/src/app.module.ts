import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './modules/employee/employee.module';
import { AccountModule } from './modules/account/account.module';
import { MongoModule } from './databases/mongo.module';
import { RecipientModule } from './modules/recipient/recipient.module';
import { DebtReminderModule } from './modules/debt-reminder/debt-reminder.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './core/transform.interceptor';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';

@Module({
  imports: [
    MongoModule,
    CustomerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EmployeeModule,
    AccountModule,
    RecipientModule,
    DebtReminderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },],
})
export class AppModule {}
