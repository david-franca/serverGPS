import { Observable } from 'rxjs';
import { Logger } from 'winston';

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { RequestWithUser } from '../../api/authentications/interface/request.interface';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(@Inject('winston') private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.log(context.switchToHttp().getRequest());
    return next.handle();
  }

  private log(req: RequestWithUser) {
    const body = { ...req.body };
    delete body.password;
    delete body.passwordConfirmation;
    const user = req.user;
    const username = user ? user.username : null;
    this.logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      route: req.route.path,
      data: {
        body: body,
        query: req.query,
        params: req.params,
      },
      from: req.ip,
      madeBy: username,
    });
  }
}
