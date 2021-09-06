import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { PrismaErrorException } from '../api/exception/PrismaError.execption';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        console.log('err =>', err);
        if (err instanceof PrismaClientKnownRequestError) {
          return throwError(() => new PrismaErrorException().handleError(err));
        }
        return throwError(() => err);
      }),
    );
  }
}
