import { Socket } from 'socket.io';

import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { AuthenticationsService } from '../api/authentications/authentications.service';

@Injectable()
export class SocketsService {
  constructor(private readonly authenticationService: AuthenticationsService) {}

  async getUserFromSocket(socket: Socket) {
    try {
      console.log(socket.id);
      const user = null;
      if (!user) {
        throw new WsException('Invalid credentials');
      }
      user.password = undefined;
      return user;
    } catch (error) {
      return null;
    }
  }
}
