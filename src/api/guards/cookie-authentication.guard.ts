import { Request } from 'express';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CookieAuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    return request.isAuthenticated();
  }
}
