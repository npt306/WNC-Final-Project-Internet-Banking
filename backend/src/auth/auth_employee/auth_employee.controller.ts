import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthEmployeeService } from './auth_employee.service';
import { PublicRouteEmployee } from '@/decorator/public-route';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { Roles } from '@/constants/roles.enum';
import { AssignRoles } from '@/decorator/assign-role';
import { JwtAccessGuard } from '@/jwt/guards/jwt-access.guard';
import { RolesGuard } from '@/jwt/guards/role.guard';
import { JwtRefreshGuard } from '@/jwt/guards/jwt-refresh.guard';

@Controller('auth/employee')
export class AuthEmployeeController {
  constructor(private readonly authService: AuthEmployeeService) {}

  // Employee auth
  @Post('login')
  @ResponseMessage('Fetch login')
  handleLoginEmployee(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  registerEmployee(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @AssignRoles(Roles.Employee)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('logout')
  logoutEmployee(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @AssignRoles(Roles.Employee)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('refresh')
  refreshTokensEmployee(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
