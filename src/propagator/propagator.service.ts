import { tap } from 'rxjs/operators';
import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';

import { RedisService } from '../redis/redis.service';
import { StateService } from '../state/state.service';
import { EventEmitDTO } from './dto/event-emit.dto';
import { EventSendDTO } from './dto/event-send.dto';
import { REDIS_EVENTS } from './propagator.enum';

@Injectable()
export class PropagatorService {
  private socketServer: Server;
  constructor(
    private readonly stateService: StateService,
    private readonly redisService: RedisService,
  ) {
    this.redisService
      .fromEvent(REDIS_EVENTS.REDIS_SOCKET_EVENT_SEND_NAME)
      .pipe(tap(this.consumeSendEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_EVENTS.REDIS_SOCKET_EVENT_EMIT_ALL_NAME)
      .pipe(tap(this.consumeEmitToAllEvent))
      .subscribe();

    this.redisService
      .fromEvent(REDIS_EVENTS.REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME)
      .pipe(tap(this.consumeEmitToAuthenticatedEvent))
      .subscribe();
  }

  public injectSocketServer(server: Server): PropagatorService {
    this.socketServer = server;

    return this;
  }

  private consumeSendEvent = (eventInfo: EventSendDTO): void => {
    const { username, event, data, socketId } = eventInfo;

    return this.stateService
      .get(username)
      .filter((socket) => socket.id !== socketId)
      .forEach((socket) => socket.emit(event, data));
  };

  private consumeEmitToAllEvent = (eventInfo: EventEmitDTO): void => {
    this.socketServer.emit(eventInfo.event, eventInfo.data);
  };

  private consumeEmitToAuthenticatedEvent = (eventInfo: EventEmitDTO): void => {
    const { event, data } = eventInfo;

    return this.stateService
      .getAll()
      .forEach((socket) => socket.emit(event, data));
  };

  public propagateEvent(eventInfo: EventSendDTO): boolean {
    if (!eventInfo.username) {
      return false;
    }

    this.redisService.publish(
      REDIS_EVENTS.REDIS_SOCKET_EVENT_SEND_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAuthenticated(eventInfo: EventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_EVENTS.REDIS_SOCKET_EVENT_EMIT_AUTHENTICATED_NAME,
      eventInfo,
    );

    return true;
  }

  public emitToAll(eventInfo: EventEmitDTO): boolean {
    this.redisService.publish(
      REDIS_EVENTS.REDIS_SOCKET_EVENT_EMIT_ALL_NAME,
      eventInfo,
    );

    return true;
  }
}
