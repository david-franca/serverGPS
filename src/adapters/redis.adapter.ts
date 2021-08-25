import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from 'redis';
import { Server, ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { ConfigService } from '@nestjs/config';
import { parse } from 'cookie';
import { AuthenticatedSocket } from '../interfaces/socket.interface';
import { Environments } from '../interfaces';

export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  private configService: ConfigService<Record<Environments, any>>;
  private pubClient: RedisClient;
  private subClient: RedisClient;
  private redisAdapter: any;
  private server: Server;
  constructor(private app: INestApplicationContext) {
    super(app);
    this.configService = app.get(ConfigService);
    this.pubClient = new RedisClient({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
    this.subClient = this.pubClient.duplicate();
    this.redisAdapter = createAdapter({
      pubClient: this.pubClient,
      subClient: this.subClient,
    });
  }
  createIOServer(port: number, options?: ServerOptions): Server {
    this.server = super.createIOServer(port, options);
    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const cookie = socket.handshake.headers.cookie;
      const { Authentication: authenticationToken } = parse(cookie);

      if (!authenticationToken) {
        socket.auth = null;
      }
      return next();
    });
    this.server.adapter(this.redisAdapter);
    return this.server;
  }
}
