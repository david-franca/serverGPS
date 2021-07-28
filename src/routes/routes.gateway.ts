import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class RoutesGateway implements OnGatewayConnection {
  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {
    client.emit('received', payload);
    return 'Hello world!';
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
  }
}
