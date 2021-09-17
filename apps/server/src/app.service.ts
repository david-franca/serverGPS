import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('PROTOCOL_SERVICE') private readonly protocolClient: ClientProxy,
  ) {
    protocolClient.send('protocol.teste', 'Olá');
  }
}
