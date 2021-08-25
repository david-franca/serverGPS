import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthenticationsService } from '../api/authentications/authentications.service';

@Injectable()
export class SocketsService {
  constructor(private readonly authenticationService: AuthenticationsService) {}

  async getUserFromSocket(socket: Socket) {
    try {
      const cookie = socket.handshake.headers.cookie;
      const { Authentication: authenticationToken } = parse(cookie);
      const user =
        await this.authenticationService.getUserFromAuthenticationToken(
          authenticationToken,
        );
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
