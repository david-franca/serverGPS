import { parse } from 'cookie';
import { RedisClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';

import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { Environments } from '../interfaces';
import { AuthenticatedSocket } from '../interfaces/socket.interface';
import { PropagatorService } from '../propagator/propagator.service';
import { StateService } from './state.service';

const configService = new ConfigService<Record<Environments, any>>();
export const pubClient: RedisClient = new RedisClient({
  host: configService.get('REDIS_HOST'),
  port: configService.get('REDIS_PORT'),
  password: configService.get('REDIS_PASSWORD'),
});
export const subClient: RedisClient = pubClient.duplicate();
const redisAdapter = createAdapter({ pubClient, subClient });

export class StateIoAdapter extends IoAdapter implements WebSocketAdapter {
  private server: Server;

  constructor(
    private readonly app: INestApplicationContext,
    private readonly stateService: StateService,
    private readonly propagatorService: PropagatorService,
  ) {
    super(app);
  }
  createIOServer(port: number, options?: ServerOptions): Server {
    this.server = super.createIOServer(port, options);
    this.propagatorService.injectSocketServer(this.server);
    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const cookie = socket.handshake.headers.cookie;
      const { Authentication: authenticationToken } = parse(cookie);

      if (!authenticationToken) {
        socket.auth = null;
        return next();
      }
      return next();
    });
    this.server.adapter(redisAdapter);
    return this.server;
  }

  public bindClientConnect(
    server: Server,
    callback: (socket: AuthenticatedSocket) => void,
  ): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.stateService.add(socket.auth.username, socket);

        socket.on('disconnect', () => {
          this.stateService.remove(socket.auth.username, socket);

          socket.removeAllListeners('disconnect');
        });
      }

      callback(socket);
    });
  }
}
