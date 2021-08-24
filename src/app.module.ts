import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { PositionService } from './services/position/position.service';
import { DevicesModule } from './api/devices/devices.module';
import { SocketsModule } from './sockets/sockets.module';
import { UsersModule } from './api/users/users.module';
import { AuthenticationsModule } from './api/authentications/authentications.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { object, string, number } from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils';
import { config } from './config/defaults';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailSchedulesModule } from './email-schedules/email-schedules.module';
import { BullModule } from '@nestjs/bull';
import { Environments } from './interfaces';
import { ProtocolModule } from './protocols/protocol.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
