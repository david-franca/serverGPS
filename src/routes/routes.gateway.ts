import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class RoutesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    // console.log('Init', server._connectTimeout);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    console.log(payload);
    client.emit('received', payload);
  }

  handleConnection(
    @ConnectedSocket() client: Socket,
    @MessageBody() ...args: any[]
  ) {
    console.log('Connected', client.id, args);
  }

  handleDisconnect(socket: Socket) {
    console.log('Disconnected', socket.id);
  }
}
