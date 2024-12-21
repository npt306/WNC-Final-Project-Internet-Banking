import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCustomerService } from '../auth_customer.service';

@Injectable()
export class LocalStrategyCustomer extends PassportStrategy(Strategy) {
  constructor(private authService: AuthCustomerService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Wrong username or password, please try again !!!");
    }
    return user;
  }
}