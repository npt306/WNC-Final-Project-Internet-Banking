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
import { AdminService } from '@/modules/admin/admin.service';
import { Roles } from '@/constants/roles.enum';

@Injectable()
export class AuthAdminService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    return this.adminService.validateUser(username, pass);
  }

  async login(data: LoginAuthDto) {
    const user = await this.adminService.validateUser(
      data.username,
      data.password,
    );
    if (!user) throw new BadRequestException('Cannot validate admin');

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
        role: Roles.ADMIN,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    return this.adminService.update(userId, { refresh_token: null });
  }

  async handleRegister(registerDto: CreateAuthDto) {
    const newAdmin = await this.adminService.createAdmin(registerDto);
    const tokens = await this.getTokens(
      newAdmin._id as unknown as string,
      newAdmin.username,
    );
    await this.updateRefreshToken(
      newAdmin._id as unknown as string,
      tokens.refreshToken,
    );
    return {
      username: newAdmin.username,
      full_name: newAdmin.full_name,
      email: newAdmin.email,
      _id: newAdmin._id,
      tokens,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.adminService.update(userId, {
      refresh_token: refreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role: Roles.ADMIN,
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
          role: Roles.ADMIN,
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
    const user = await this.adminService.findById(userId);
    if (!user || !user.refresh_token)
      throw new ForbiddenException('Access for admin denied');

    const refreshTokenMatches = compareRefreshToken(
      user.refresh_token,
      refreshToken,
    );
    if (!refreshTokenMatches)
      throw new ForbiddenException('Access for admin denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }
}
