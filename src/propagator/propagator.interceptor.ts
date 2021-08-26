import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticatedSocket } from '../interfaces/socket.interface';
import { PropagatorService } from './propagator.service';

@Injectable()
export class RedisPropagatorInterceptor<T>
  implements NestInterceptor<T, WsResponse<T>>
{
  public constructor(private readonly propagatorService: PropagatorService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<WsResponse<T>> {
    const socket: AuthenticatedSocket = context.switchToWs().getClient();

    return next.handle().pipe(
      tap((data) => {
        this.propagatorService.propagateEvent({
          ...data,
          socketId: socket.id,
          username: socket.auth?.username,
        });
      }),
    );
  }
}
