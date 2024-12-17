import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from '@/decorator/public-route';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Request } from 'express';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @PublicRoute()
  @Post("login")
  @ResponseMessage("Fetch login")
  handleLogin(@Body() loginDto: LoginAuthDto) {
    return this.authService.login(loginDto);
  }

  @PublicRoute()
  @Post("register")
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }

  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req['user']['sub']);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req['user']['sub'];
    const refreshToken = req['user']['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
