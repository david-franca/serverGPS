import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { SocketsService } from './sockets.service';
import { Server, Socket } from 'socket.io';
import { Position } from '../models';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: ['http://localhost:3000'],
  },
})
export class SocketsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly socketsService: SocketsService,
    private eventEmitter: EventEmitter2,
  ) {}

  afterInit() {
    // TODO
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.socketsService.getUserFromSocket(client);
    this.eventEmitter.on('positions.received', (position: Position) => {
      client.emit('positions.sended', position);
    });
  }

  handleDisconnect(socket: Socket) {
    console.log('Disconnected', socket.id);
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

  // @SubscribeMessage('createSocket')
  // create(@MessageBody() createSocketDto: CreateSocketDto) {
  //   return this.socketsService.create(createSocketDto);
  // }

  // @SubscribeMessage('findAllSockets')
  // findAll() {
  //   return this.socketsService.findAll();
  // }

  // @SubscribeMessage('findOneSocket')
  // findOne(@MessageBody() id: number) {
  //   return this.socketsService.findOne(id);
  // }

  // @SubscribeMessage('updateSocket')
  // update(@MessageBody() updateSocketDto: UpdateSocketDto) {
  //   return this.socketsService.update(updateSocketDto.id, updateSocketDto);
  // }

  // @SubscribeMessage('removeSocket')
  // remove(@MessageBody() id: number) {
  //   return this.socketsService.remove(id);
  // }
}
