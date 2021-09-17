import { Controller, Inject } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';

import { Position } from '../models';
import { ProtocolService } from './protocol.service';

@Controller()
export class ProtocolController {
  constructor(
    @Inject('SERVER_SERVICE') private readonly serverClient: ClientProxy,
    private protocolService: ProtocolService,
  ) {}

  @OnEvent('BD.Positions.Class')
  public async create(position: Position) {
    console.log('Received');
    await this.protocolService.handlePositions(position);
    return this.serverClient.emit(
      { cmd: 'BD.Position.Object' },
      position.getAllData(),
    );
  }
}
