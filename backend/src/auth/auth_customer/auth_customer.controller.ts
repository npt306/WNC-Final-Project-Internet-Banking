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
import { AuthCustomerService } from './auth_customer.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { AssignRoles } from '@/decorator/assign-role';
import { Roles } from '@/constants/roles.enum';
import { RolesGuard } from '@/jwt/guards/role.guard';
import { JwtAccessGuard } from '@/jwt/guards/jwt-access.guard';
import { JwtRefreshGuard } from '@/jwt/guards/jwt-refresh.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendEmailCustomerDto } from './dto/send-email.dto';

@Controller('auth/customer')
export class AuthCustomerController {
  constructor(private readonly authService: AuthCustomerService) {}

  // Customer auth
  @Post('login')
  @ResponseMessage('Fetch login')
  handleLoginCustomer(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  registerCustomer(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @AssignRoles(Roles.CUSTOMER)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('logout')
  logoutCustomer(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @AssignRoles(Roles.CUSTOMER)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('refresh')
  refreshTokensCustomer(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('forgot-password')
  forgotPasswordCustomer(@Body() sendEmailDto: SendEmailCustomerDto) {
    return this.authService.sendEmail(sendEmailDto);
  }

  @Post('reset-password')
  changePasswordCustomer(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
