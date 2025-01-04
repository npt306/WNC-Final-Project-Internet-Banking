import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IpWhitelistGuard implements CanActivate {
  private readonly whitelist: string[] = [
    '127.0.0.1', //Localhost
    '103.199.18.250',
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    // const clientIp = request.ip || request.connection.remoteAddress;
    const clientIp = request.headers['x-forwarded-for'] || request.ip || request.connection.remoteAddress;

    if (this.whitelist.includes('0.0.0.0')) {
      return true; //grant access to all
    }

    if (this.whitelist.includes(clientIp)) {
      return true; // Grant access
    }
    throw new UnauthorizedException('Your IP address is not whitelisted');
  }
}
