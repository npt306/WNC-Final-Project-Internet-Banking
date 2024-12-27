import { Module } from '@nestjs/common';
import { AuthEmployeeService } from './auth_employee.service';
import { AuthEmployeeController } from './auth_employee.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { EmployeeModule } from '@/modules/employee/employee.module';
import { LocalStrategy } from '@/jwt/strategies/local.strategy';
import { JwtAccessGuard } from '@/jwt/guards/jwt-access.guard';
import { JwtRefreshGuard } from '@/jwt/guards/jwt-refresh.guard';

@Module({
  controllers: [AuthEmployeeController],
  imports: [EmployeeModule, JwtModule.register({}), PassportModule],
  providers: [AuthEmployeeService, JwtAccessGuard, JwtRefreshGuard],
})
export class AuthEmployeeModule {}
