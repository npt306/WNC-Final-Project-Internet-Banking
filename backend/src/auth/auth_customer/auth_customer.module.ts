import { Module } from '@nestjs/common';
import { AuthCustomerService } from './auth_customer.service';
import { AuthCustomerController } from './auth_customer.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategyCustomer } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategyCustomer } from './strategies/jwt-refresh.strategy';
import { CustomerModule } from '@/modules/customer/customer.module';

@Module({
  controllers: [AuthCustomerController],
  imports: [
    CustomerModule,
    JwtModule.register({}),
    PassportModule
  ],
  providers: [AuthCustomerService, LocalStrategy, JwtAccessStrategyCustomer, JwtRefreshStrategyCustomer],
})
export class AuthCustomerModule {}
