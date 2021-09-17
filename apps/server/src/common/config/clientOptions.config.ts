import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

import { Environments } from '@types';
import { Queue } from './';

export const clientOptions: ClientsModuleAsyncOptions = [
  {
    name: 'PROTOCOL_SERVICE',
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService<Record<Environments, any>>) => ({
      transport: Transport.RMQ,
      options: {
        noAck: false,
        urls: [config.get<string>('RABBITMQ_URL')],
        queue: Queue.PROTOCOL,
        queueOptions: {
          durable: true,
        },
      },
    }),
  },
];
