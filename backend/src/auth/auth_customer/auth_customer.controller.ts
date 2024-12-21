import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthCustomerService } from './auth_customer.service';
import { PublicRouteEmployee } from '@/decorator/public-route-employee';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { JwtRefreshGuardCustomer } from './guards/jwt-refresh.guard';
import { PublicRouteCustomer } from '@/decorator/public-route-customer';

@PublicRouteEmployee()
@Controller('auth/customers')
export class AuthCustomerController {
  constructor(
    private readonly authService: AuthCustomerService
  ) {}
  
  // Customer auth
  @PublicRouteCustomer()
  @Post("login")
  @ResponseMessage("Fetch login")
  handleLoginCustomer(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @PublicRouteCustomer()
  @Post("register")
  registerCustomer(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('logout')
  logoutCustomer(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @UseGuards(JwtRefreshGuardCustomer)
  @Get('refresh')
  refreshTokensCustomer(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
