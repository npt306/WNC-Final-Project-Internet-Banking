import { Module } from '@nestjs/common';
import { AuthAdminService } from './auth_admin.service';
import { AuthAdminController } from './auth_admin.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AdminModule } from '@/modules/admin/admin.module';
import { JwtAccessStrategy } from '@/jwt/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/jwt/strategies/jwt-refresh.strategy';

@Module({
  controllers: [AuthAdminController],
  imports: [AdminModule, JwtModule.register({}), PassportModule],
  providers: [AuthAdminService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthAdminModule {}
