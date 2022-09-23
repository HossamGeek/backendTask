import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AcceptedAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('context: ', context);
    
    // const req = context.switchToHttp().getRequest();
    // const user: User = req.user;
    // if (user) {
    //   const hasRole = () => user.roles.some(role => role === Role.ADMIN || role === Role.USER);
    //   return hasRole();
    // } else {
    //   return false;
    // }

    return true;
  }
}
