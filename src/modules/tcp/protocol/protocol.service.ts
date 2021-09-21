import { Queue } from 'bull';

import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { Position } from '../models';

@Injectable()
export class ProtocolService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectQueue('position') private readonly positionQueue: Queue,
  ) {}

  @OnEvent('BD.Positions.Class')
  async handlePositions(position: Position) {
    await this.positionQueue.add(
      'save',
      {
        position: position.getAllData(),
      },
      {
        priority: 3,
        attempts: 3,
        timeout: 10000,
        removeOnComplete: true,
      },
    );
  }
}
