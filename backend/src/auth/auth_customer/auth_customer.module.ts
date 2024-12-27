import { Module } from '@nestjs/common';
import { AuthCustomerService } from './auth_customer.service';
import { AuthCustomerController } from './auth_customer.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../jwt/strategies/local.strategy';
import { CustomerModule } from '@/modules/customer/customer.module';
import { JwtAccessStrategy } from '@/jwt/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/jwt/strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthCustomerController],
  imports: [CustomerModule, JwtModule.register({}), PassportModule],
  providers: [
    AuthCustomerService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthCustomerModule {}
