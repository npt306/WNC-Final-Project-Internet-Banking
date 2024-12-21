import { Module } from '@nestjs/common';
import { AuthEmployeeService } from './auth_employee.service';
import { AuthEmployeeController } from './auth_employee.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessStrategyEmployee } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategyEmployee } from './strategies/jwt-refresh.strategy';
import { EmployeeModule } from '@/modules/employee/employee.module';

@Module({
  controllers: [AuthEmployeeController],
  imports: [
    EmployeeModule,
    JwtModule.register({}),
    PassportModule
  ],
  providers: [AuthEmployeeService, LocalStrategy, JwtAccessStrategyEmployee, JwtRefreshStrategyEmployee],
})
export class AuthEmployeeModule {}
