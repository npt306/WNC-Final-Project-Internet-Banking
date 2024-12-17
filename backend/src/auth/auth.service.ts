import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from "@/modules/customer/customer.service"
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compareRefreshToken } from '@/helpers/utils';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return this.customerService.validateUser(username, pass);
  }

  async login(data: LoginAuthDto) {
    const user = await this.customerService.validateUser(data.username, data.password);
    if (!user) throw new BadRequestException('Cannot validate user');

    const tokens = await this.getTokens(user._id as unknown as string, user.username);
    await this.updateRefreshToken(user._id as unknown as string, tokens.refreshToken);
    return {
      user: {
        email: user.email,
        _id: user._id,
        username: user.username
      },
      tokens
    };
  }

  async logout(userId: string) {
    return this.customerService.update(userId, { refresh_token: null });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const newUser = await this.customerService.createCustomer(registerDto);
    const tokens = await this.getTokens(newUser._id as unknown as string, newUser.username);
    await this.updateRefreshToken(newUser._id as unknown as string, tokens.refreshToken);
    return {
      ...newUser,
      tokens
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    // const hashedRefreshToken = await this.hashData(refreshToken);
    await this.customerService.update(userId, {
      refresh_token: refreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRED"),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRED"),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.customerService.findById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = compareRefreshToken(user.refresh_token, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }
}