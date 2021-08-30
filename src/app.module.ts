import { WinstonModule } from 'nest-winston';

import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthenticationsModule } from './api/authentications/authentications.module';
import { DevicesModule } from './api/devices/devices.module';
import { UsersModule } from './api/users/users.module';
import { AppService } from './app.service';
import {
  asyncBullConfig,
  configOptions,
  defaultsConfig,
  mailerConfig,
  throttlerAsyncOptions,
  winstonConfig,
} from './config';
import { EmailSchedulesModule } from './email/email-schedules.module';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { PropagatorModule } from './propagator/propagator.module';
import { ProtocolModule } from './protocols/protocol.module';
import { RedisModule } from './redis/redis.module';
import { PositionService } from './services/position/position.service';
import { SocketsModule } from './sockets/sockets.module';
import { StateModule } from './state/state.module';
import { ExceptionsLoggerFilter } from './utils';

@Module({
  controllers: [],
  imports: [
    PrismaModule,
    DevicesModule,
    SocketsModule,
    UsersModule,
    AuthenticationsModule,
    EmailSchedulesModule,
    ProtocolModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    StateModule,
    PropagatorModule,
    RedisModule,
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    ConfigModule.forRoot(configOptions),
    BullModule.forRootAsync(asyncBullConfig),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
  ],
  providers: [
    AppService,
    PrismaService,
    PositionService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    { provide: 'GPS_CONFIG_OPTIONS', useValue: { config: defaultsConfig } },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
