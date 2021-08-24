import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { Position } from '../models';
import { PositionService } from '../services/position/position.service';

@Processor('position')
export class ProtocolProcessor {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    private positionService: PositionService,
    private eventEmitter: EventEmitter2,
  ) {}
  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }

  @OnQueueFailed()
  onError(job: Job, error) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(
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
    return;
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
