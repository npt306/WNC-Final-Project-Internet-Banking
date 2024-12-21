import { Module } from '@nestjs/common';
import { AuthCustomerService } from './auth_customer.service';
import { AuthCustomerController } from './auth_customer.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategyCustomer } from './strategies/local.strategy';
import { JwtAccessStrategyCustomer } from './strategies/jwt-access.strategy';
import { CustomerModule } from '@/modules/customer/customer.module';
import { JwtRefreshStrategyCustomer } from './strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthCustomerController],
  imports: [
    CustomerModule,
    JwtModule.register({}),
    PassportModule
  ],
  providers: [AuthCustomerService, LocalStrategyCustomer, JwtAccessStrategyCustomer, JwtRefreshStrategyCustomer],
})
export class AuthCustomerModule {}
