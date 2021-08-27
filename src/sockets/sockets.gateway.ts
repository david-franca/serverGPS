import { Server, Socket } from 'socket.io';

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Environments } from '../interfaces';
import { Position } from '../models';
import { SocketsService } from './sockets.service';

const configService = new ConfigService<Record<Environments, any>>();

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: configService.get<string>('CORS_HOST').split(', '),
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly socketsService: SocketsService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit() {
    return this.logger.log('Init WebSocket Gateway');
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.socketsService.getUserFromSocket(client);
    if (!user) {
      return;
    }
    this.eventEmitter.on('positions.received', (position: Position) => {
      client.emit('positions.sended', position);
    });
  }

  handleDisconnect(client: Socket) {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createSocket')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.socketsService.getUserFromSocket(socket);

    this.server.sockets.emit('receive_message', {
      content,
      user,
    });
  }
}
