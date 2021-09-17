import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { Environments } from '@types';
import { Queue } from '../config/queue.enum';
import { PositionService } from '../position/position.service';
import { ProtocolController } from './protocol.controller';
import { ProtocolProcessor } from './protocol.processor';
import { ProtocolService } from './protocol.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'position',
    }),
    ClientsModule.registerAsync([
      {
        name: 'SERVER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService<Record<Environments, any>>) => ({
          transport: Transport.RMQ,
          options: {
            noAck: false,
            urls: [config.get<string>('RABBITMQ_URL')],
            queue: Queue.SERVER,
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  providers: [ProtocolService, PositionService, ProtocolProcessor],
  controllers: [ProtocolController],
})
export class ProtocolModule {}
