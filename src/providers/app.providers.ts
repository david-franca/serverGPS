import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { AppService } from '../app.service';
import {
  CookieAuthenticationGuard,
  defaultsConfig,
  ExceptionsLoggerFilter,
  LoggerInterceptor,
} from '../common';
import { PrismaService } from '../modules';

export const providers: Provider<any>[] = [
  AppService,
  PrismaService,
  { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
  { provide: APP_GUARD, useClass: ThrottlerGuard },
  { provide: APP_GUARD, useClass: CookieAuthenticationGuard },
  { provide: 'GPS_CONFIG_OPTIONS', useValue: { config: defaultsConfig } },
];
