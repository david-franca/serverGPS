import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Server, Socket } from 'socket.io';
import { Logger } from 'winston';

import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Environments } from '@types';

import { SocketsService } from './sockets.service';

const configService = new ConfigService<Record<Environments, any>>();

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: configService.get<string>('CORS_HOST'),
  },
})
export class SocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private readonly socketsService: SocketsService,
    private eventEmitter: EventEmitter2,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const user = await this.socketsService.getUserFromSocket(client);
    if (!user) {
      return;
    }
    this.eventEmitter.on('BD.Positions.Site', (position) => {
      client.emit('BD.Positions.Site', position);
    });
  }

  handleDisconnect(client: Socket) {
    return this.logger.info(`Client disconnected: ${client.id}`);
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
