import { number, object, string } from '@hapi/joi';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthenticationsModule } from './api/authentications/authentications.module';
import { DevicesModule } from './api/devices/devices.module';
import { UsersModule } from './api/users/users.module';
import { AppService } from './app.service';
import { config } from './config/defaults';
import { EmailSchedulesModule } from './email-schedules/email-schedules.module';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { Environments } from './interfaces';
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
    EmailModule,
    EmailSchedulesModule,
    ProtocolModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    StateModule,
    PropagatorModule,
    RedisModule,
    ConfigModule.forRoot({
      validationSchema: object({
        DATABASE_URL: string().required(),
        JWT_REFRESH_TOKEN_PRIVATE_KEY: string().required(),
        JWT_REFRESH_TOKEN_PUBLIC_KEY: string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: number().required(),
        JWT_ACCESS_TOKEN_PRIVATE_KEY: string().required(),
        JWT_ACCESS_TOKEN_PUBLIC_KEY: string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: number().required(),
        REDIS_HOST: string().required(),
        REDIS_PORT: number().required(),
        REDIS_PASSWORD: string().required(),
        SALT_NUMBER: number().required(),
        CORS_HOST: string().required(),
        EMAIL_HOST: string().required(),
        EMAIL_USER: string().required(),
        EMAIL_PASSWORD: string().required(),
        EMAIL_PORT: number().required(),
        SERVER_PORT: number().required(),
        SESSION_SECRET: string().required(),
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService<Record<Environments, any>>,
      ) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AppService,
    PrismaService,
    PositionService,
    EmailService,
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    { provide: 'GPS_CONFIG_OPTIONS', useValue: { config } },
    { provide: 'GPS_LOGGER', useClass: Logger },
  ],
})
export class AppModule {}
