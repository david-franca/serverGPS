import { DynamicModule, Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { Options } from './interfaces';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoutesGateway } from './routes/routes.gateway';
import { PositionService } from './services/position/position.service';
import { DevicesModule } from './api/devices/devices.module';
import { SocketsModule } from './sockets/sockets.module';
import { UsersModule } from './api/users/users.module';
import { AuthenticationsModule } from './api/authentications/authentications.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionsLoggerFilter } from './utils/exceptionsLogger.filter';

@Module({})
export class AppModule {
  static async forRoot(options: Options): Promise<DynamicModule> {
    options.imports = [];
    options.providers = [];
    options.providers.push({
      provide: 'GPS_LOGGER',
      useClass: options.logger ? options.logger : Logger,
    });
    options.providers.push({
      provide: 'GPS_CONFIG_OPTIONS',
      useValue: options,
    });
    options.providers.push(
      AppService,
      RoutesGateway,
      PrismaService,
      PositionService,
      { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    );
    options.imports.push(
      PrismaModule,
      DevicesModule,
      SocketsModule,
      UsersModule,
      AuthenticationsModule,
      ConfigModule.forRoot({
        validationSchema: Joi.object({
          DATABASE_URL: Joi.string().required(),
          JWT_SECRET: Joi.string().required(),
          JWT_EXPIRATION_TIME: Joi.string().required(),
          JWT_PRIVATE_KEY: Joi.string().required(),
          JWT_PUBLIC_KEY: Joi.string().required(),
        }),
      }),
    );
    return {
      module: AppModule,
      imports: options.imports,
      providers: options.providers,
    };
  }
}
