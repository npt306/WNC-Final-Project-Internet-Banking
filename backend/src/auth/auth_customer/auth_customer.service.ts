import { ChangePasswordDto } from './dto/change-password.dto';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ConfigService } from '@nestjs/config';
import { LoginAuthDto } from './dto/login-auth.dto';
import { compareRefreshToken } from '@/helpers/utils';
import { CustomerService } from '@/modules/customer/customer.service';
import { Roles } from '@/constants/roles.enum';
import { SendEmailDto } from './dto/send-email.dto';
import { send } from 'process';
import { MailerCustomService } from '@/mail/mailer.service';

@Injectable()
export class AuthCustomerService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerCustomService: MailerCustomService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return this.customerService.validateUser(username, pass);
  }

  async login(data: LoginAuthDto) {
    const user = await this.customerService.validateUser(
      data.username,
      data.password,
    );
    if (!user) throw new BadRequestException('Cannot validate customer');

    const tokens = await this.getTokens(
      user._id as unknown as string,
      user.username,
    );
    await this.updateRefreshToken(
      user._id as unknown as string,
      tokens.refreshToken,
    );
    return {
      user: {
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        _id: user._id,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    return this.customerService.update(userId, { refresh_token: null });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const newCustomer = await this.customerService.createCustomer(registerDto);
    const tokens = await this.getTokens(
      newCustomer._id as unknown as string,
      newCustomer.username,
    );
    await this.updateRefreshToken(
      newCustomer._id as unknown as string,
      tokens.refreshToken,
    );
    return {
      username: newCustomer.username,
      full_name: newCustomer.full_name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      _id: newCustomer._id,
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
          role: Roles.Customer,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role: Roles.Customer,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRED'),
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
      throw new ForbiddenException('Access for customer denied');

    const refreshTokenMatches = compareRefreshToken(
      user.refresh_token,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException('Access for customer denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    return this.mailerCustomService.sendMailCustomer(sendEmailDto);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    return this.customerService.changePassword(changePasswordDto);
  }
}
