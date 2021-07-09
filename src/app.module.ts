import { Logger, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { Options } from './interfaces/options.interface';

@Module({})
export class AppModule {
  static async forRoot(options: Options) {
    options.imports = options.imports ?? [];
    options.providers = options.providers ?? [];
    options.providers.push({
      provide: 'GPS_LOGGER',
      useClass: options.logger ? options.logger : Logger,
    });
    options.providers.push({
      provide: 'GPS_CONFIG_OPTIONS',
      useValue: options,
    });
    options.providers.push(AppService);
    return {
      module: AppModule,
      imports: options.imports,
      providers: options.providers,
    };
  }
}
