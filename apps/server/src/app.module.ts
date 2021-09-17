import { WinstonModule } from 'nest-winston';

import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClientsModule } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthenticationsModule } from './api/authentications/authentications.module';
import { BranchesModule } from './api/branches/branches.module';
import { CustomersModule } from './api/customers/customers.module';
import { DevicesModule } from './api/devices/devices.module';
import { EmailSchedulesModule } from './api/email/email-schedules.module';
import { CookieAuthenticationGuard } from './api/guards/cookie-authentication.guard';
import { HealthModule } from './api/health/health.module';
import { UsersModule } from './api/users/users.module';
import { VehiclesModule } from './api/vehicles/vehicles.module';
import { AppService } from './app.service';
import { CaslModule } from './casl/casl.module';
import {
  asyncBullConfig,
  clientOptions,
  configOptions,
  mailerConfig,
  throttlerAsyncOptions,
  winstonConfig,
} from './common/config';
import { ExceptionsLoggerFilter } from './common/filters';
import { LoggerInterceptor } from './common/interceptors';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SocketsModule } from './sockets/sockets.module';
import { StateModule } from './state/state.module';
import { SubscribersModule } from './subscribers/subscribers.module';

@Module({
  imports: [
    PrismaModule,
    DevicesModule,
    SocketsModule,
    UsersModule,
    AuthenticationsModule,
    EmailSchedulesModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    StateModule,
    TerminusModule,
    WinstonModule.forRoot(winstonConfig),
    MailerModule.forRoot(mailerConfig),
    ConfigModule.forRoot(configOptions),
    BullModule.forRootAsync(asyncBullConfig),
    ThrottlerModule.forRootAsync(throttlerAsyncOptions),
    ClientsModule.registerAsync(clientOptions),
    HealthModule,
    CustomersModule,
    VehiclesModule,
    BranchesModule,
    SubscribersModule,
    CaslModule,
  ],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_FILTER, useClass: ExceptionsLoggerFilter },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: CookieAuthenticationGuard },
  ],
})
export class AppModule {}
