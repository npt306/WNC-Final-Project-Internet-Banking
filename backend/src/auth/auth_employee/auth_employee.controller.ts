import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthEmployeeService } from './auth_employee.service';
import { PublicRouteEmployee } from '@/decorator/public-route-employee';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { JwtAccessGuardEmployee } from './guards/jwt-access.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { JwtRefreshGuardEmployee } from './guards/jwt-refresh.guard';
import { PublicRouteCustomer } from '@/decorator/public-route-customer';

@PublicRouteCustomer()
@Controller('auth/employees')
export class AuthEmployeeController {
  constructor(
    private readonly authService: AuthEmployeeService
  ) {}
  
  // Employee auth
  @PublicRouteEmployee()
  @Post("login")
  @ResponseMessage("Fetch login")
  handleLoginEmployee(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @PublicRouteEmployee()
  @Post("register")
  registerEmployee(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('logout')
  logoutEmployee(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @UseGuards(JwtRefreshGuardEmployee)
  @Get('refresh')
  refreshTokensEmployee(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
