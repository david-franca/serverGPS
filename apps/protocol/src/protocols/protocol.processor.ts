import { Job } from 'bull';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Position } from '../models';
import { PositionService } from '../position/position.service';

@Processor('position')
export class ProtocolProcessor {
  constructor(
    private positionService: PositionService,
    private eventEmitter: EventEmitter2,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.verbose(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.verbose(
      `Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(
        result,
      )}`,
    );
  }

  @Process('save')
  async handleSave(job: Job): Promise<void> {
    const rawPosition = job.data.position;
    const position = this.setPosition(rawPosition);
    await this.savePositions(position);
  }

  private async savePositions(position: Position): Promise<void> {
    if (position.getBoolean('location')) {
      await this.positionService.createLocation(position);
    }

    if (position.getBoolean('statusInfo')) {
      await this.positionService.createStatus(position);
    }
  }

  setPosition(data: { [s: string]: any } | ArrayLike<any>): Position {
    const position = new Position();
    const rawDatas = Object.entries(data);
    rawDatas.forEach((data) => {
      if (typeof data[1] === 'object')
        data[1] = new Map(Object.entries(data[1]));

      const setCase =
        'set' + data[0].charAt(0).toUpperCase() + data[0].slice(1);
      position[`${setCase}`](data[1]);
    });
    return position;
  }
}
