import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginCredentialsGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check the email and the password
    const result = (await super.canActivate(context)) as boolean;

    // initialize the session
    const request = context.switchToHttp().getRequest();
    await super.logIn(request);

    // if no exceptions were thrown, allow the access to the route
    return result;
  }
}
