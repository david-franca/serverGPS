import { DynamicModule, Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { Options } from './interfaces';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RoutesGateway } from './routes/routes.gateway';
import { PositionService } from './services/position/position.service';
import { DevicesModule } from './devices/devices.module';
import { SocketsModule } from './sockets/sockets.module';

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
    options.providers.push(AppService);
    options.providers.push(RoutesGateway);
    options.providers.push(PrismaService);
    options.providers.push(PositionService);
    options.imports.push(PrismaModule, DevicesModule, SocketsModule);
    return {
      module: AppModule,
      imports: options.imports,
      providers: options.providers,
    };
  }
}
