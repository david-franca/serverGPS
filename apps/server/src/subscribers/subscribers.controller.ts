import { EventEmitter2 } from 'eventemitter2';

import {
  ClassSerializerInterceptor,
  Controller,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CreatePositionDto } from './dto/create-subscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    @Inject('PROTOCOL_SERVICE') private protocolService: ClientProxy,
    private eventEmitter: EventEmitter2,
  ) {}

  @MessagePattern({ cmd: 'BD.Position.Object' })
  async addSubscriber(
    @Payload() payload: CreatePositionDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(payload);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.eventEmitter.emit('BD.Positions.Site', payload);
    } catch (error) {
      console.log(error);
    } finally {
      channel.ack(originalMsg);
    }
  }
}
