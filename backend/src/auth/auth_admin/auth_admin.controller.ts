import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthAdminService } from './auth_admin.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { Roles } from '@/constants/roles.enum';
import { AssignRoles } from '@/decorator/assign-role';
import { JwtRefreshGuard } from '@/jwt/guards/jwt-refresh.guard';
import { RolesGuard } from '@/jwt/guards/role.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth Admin')
@Controller('auth/admin')
export class AuthAdminController {
  constructor(private readonly authService: AuthAdminService) {}

  @Post('login')
  @ResponseMessage('Fetch login')
  @ApiOperation({ summary: 'Login for admin' })
  @ApiBody({
    type: LoginAuthDto,
    examples: {
      admin_login: {
        value: {
          username: 'admin',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        user: {
          username: 'admin',
          full_name: 'Admin User',
          email: 'admin@example.com',
          _id: '507f1f77bcf86cd799439011',
          role: Roles.ADMIN,
        },
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  handleLoginAdmin(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new admin' })
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      admin_register: {
        value: {
          username: 'newadmin',
          full_name: 'New Admin',
          email: 'newadmin@example.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Admin registered successfully',
    schema: {
      example: {
        username: 'newadmin',
        full_name: 'New Admin',
        email: 'newadmin@example.com',
        _id: '507f1f77bcf86cd799439011',
        tokens: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  registerAdmin(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @AssignRoles(Roles.ADMIN)
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Get('logout')
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  logoutAdmin(@Req() req: Request) {
    return this.authService.logout(req['user']['sub']);
  }
}
