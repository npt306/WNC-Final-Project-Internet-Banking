import { IS_PUBLIC_KEY_CUSTOMER } from '@/decorator/public-route-customer';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshGuardCustomer extends AuthGuard('jwt-refresh') {
    constructor(private reflector: Reflector){
        super();
    }
    
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY_CUSTOMER, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {
            return true;
          }
        return super.canActivate(context);
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
    }

    handleRequest(err, user, info) {
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Invalid customer refresh token !!!");
        }
        return user;
    }
}
