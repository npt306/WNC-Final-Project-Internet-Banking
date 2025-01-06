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
import { EmployeeService } from '@/modules/employee/employee.service';
import { Roles } from '@/constants/roles.enum';

@Injectable()
export class AuthEmployeeService {
  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return this.employeeService.validateUser(username, pass);
  }

  async login(data: LoginAuthDto) {
    const user = await this.employeeService.validateUser(
      data.username,
      data.password,
    );
    if (!user) throw new BadRequestException('Cannot validate employee');

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
        _id: user._id,
        role : "employee"
      },
      tokens,
    };
  }

  async logout(userId: string) {
    return this.employeeService.update(userId, { refresh_token: null });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const newEmployee = await this.employeeService.createEmployee(registerDto);
    const tokens = await this.getTokens(
      newEmployee._id as unknown as string,
      newEmployee.username,
    );
    await this.updateRefreshToken(
      newEmployee._id as unknown as string,
      tokens.refreshToken,
    );
    return {
      username: newEmployee.username,
      full_name: newEmployee.full_name,
      email: newEmployee.email,
      tokens
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    // const hashedRefreshToken = await this.hashData(refreshToken);
    await this.employeeService.update(userId, {
      refresh_token: refreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role: Roles.EMPLOYEE,
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
          role: Roles.EMPLOYEE,
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
    const user = await this.employeeService.findById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access for employee denied');

    const refreshTokenMatches = compareRefreshToken(
      user.refresh_token,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException('Access for employee Denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }
}
