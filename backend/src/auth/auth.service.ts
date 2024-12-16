import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from "@/modules/customer/customer.service"
import { comparePasswordHelper } from '@/helpers/utils';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.customerService.findByUsername(username);
    if(!user) return null;
    const isValidPassword = await comparePasswordHelper(pass, user.password);
  
    if(!user || !isValidPassword) return null;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    return {
      user: {
        email: user.email,
        _id: user._id,
        username: user.username
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  handleRegister(registerDto: CreateAuthDto) {
    return this.customerService.createCustomer(registerDto);
  }
}