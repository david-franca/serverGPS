import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoutesGateway } from './routes/routes.gateway';
import { PositionService } from './services/position/position.service';
import { DevicesModule } from './api/devices/devices.module';
import { SocketsModule } from './sockets/sockets.module';
import { UsersModule } from './api/users/users.module';
import { AuthenticationsModule } from './api/authentications/authentications.module';
import { ConfigModule } from '@nestjs/config';
import { object, string, number } from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils';
import { config } from './config/defaults';

@Module({
  controllers: [],
  imports: [
    PrismaModule,
    DevicesModule,
    SocketsModule,
    UsersModule,
    AuthenticationsModule,
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
      }),
    }),
  ],
  providers: [
    AppService,
    RoutesGateway,
    PrismaService,
    PositionService,
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    { provide: 'GPS_CONFIG_OPTIONS', useValue: { config } },
    { provide: 'GPS_LOGGER', useClass: Logger },
  ],
})
export class AppModule {}
