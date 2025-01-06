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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth customer')
@Controller('auth/customer')
export class AuthCustomerController {
  constructor(private readonly authService: AuthCustomerService) {}

  // Customer auth
  @ApiOperation({ summary: 'Login to customer account' })
  @ApiResponse({
    status: 200,
    description: 'Return customer account info'
  })
  @Post('login')
  @ResponseMessage('Fetch login')
  handleLoginCustomer(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Register new customer account' })
  @ApiResponse({
    status: 200,
    description: 'Return new customer account info'
  })
  @Post('register')
  registerCustomer(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @ApiOperation({ summary: 'Logout from customer account' })
  @AssignRoles(Roles.Customer)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('logout')
  logoutCustomer(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @ApiOperation({ summary: 'Get new access token' })
  @ApiResponse({
    status: 200,
    description: 'Return new access token'
  })
  @AssignRoles(Roles.Customer)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('refresh')
  refreshTokensCustomer(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Send mail to change password' })
  @ApiResponse({
    status: 200,
    description: 'Return found customer account _id'
  })
  @Post('forgot-password')
  forgotPasswordCustomer(@Body() sendEmailDto: SendEmailCustomerDto) {
    return this.authService.sendEmail(sendEmailDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'Return found customer account _id'
  })
  @Post('reset-password')
  changePasswordCustomer(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }
}
