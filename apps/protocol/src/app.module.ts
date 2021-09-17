import { WinstonModule } from 'nest-winston';

import { object, string } from '@hapi/joi';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ProtocolService } from './app.service';
import { asyncBullConfig, winstonConfig } from './config';
import { defaultsConfig } from './config/defaults.config';
import { PositionService } from './position/position.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProtocolModule } from './protocols/protocol.module';

@Module({
  imports: [
    PrismaModule,
    ProtocolModule,
    EventEmitterModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    BullModule.forRootAsync(asyncBullConfig),
    ConfigModule.forRoot({
      cache: true,
      validationSchema: object({
        NODE_ENV: string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        RABBITMQ_URL: string().required(),
      }),
    }),
  ],
  providers: [
    ProtocolService,
    PositionService,
    { provide: 'GPS_CONFIG_OPTIONS', useValue: { config: defaultsConfig } },
  ],
})
export class AppModule {}
