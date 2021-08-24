import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
import { AuthenticationsService } from '../api/authentications/authentications.service';
// import { CreateSocketDto } from './dto/create-socket.dto';
// import { UpdateSocketDto } from './dto/update-socket.dto';

@Injectable()
export class SocketsService {
  constructor(private readonly authenticationService: AuthenticationsService) {}

  async getUserFromSocket(socket: Socket) {
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
  }

  // create(createSocketDto: CreateSocketDto) {
  //   return 'This action adds a new socket';
  // }

  // findAll() {
  //   return `This action returns all sockets`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} socket`;
  // }

  // update(id: number, updateSocketDto: UpdateSocketDto) {
  //   return `This action updates a #${id} socket`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} socket`;
  // }
}
