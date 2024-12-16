import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '@/auth/passport/local-auth.guard';
import { PublicRoute } from '@/decorator/public-route';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ResponseMessage } from '@/decorator/response-message';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @PublicRoute()
  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("Fetch login")
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @PublicRoute()
  @Post("register")
  register(@Body() registerDto: CreateAuthDto) {
    return this.authService.handleRegister(registerDto);
  }
}
