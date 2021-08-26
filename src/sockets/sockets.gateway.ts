import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { Position } from '../models';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environments } from '../interfaces';

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
