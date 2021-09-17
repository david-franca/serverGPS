import { WinstonModule } from 'nest-winston';

import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { winstonConfig } from './config';
import { Queue } from './config/queue.enum';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        noAck: false,
        queue: Queue.PROTOCOL,
        queueOptions: {
          durable: true,
        },
      },
      logger,
    },
  );

  await app.listen();
}
bootstrap();
