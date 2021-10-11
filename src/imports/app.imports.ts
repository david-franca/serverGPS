import { WinstonModule } from 'nest-winston';
import { join } from 'path';

import {
  asyncBullConfig,
  configOptions,
  mailerConfig,
  throttlerAsyncOptions,
  winstonConfig,
} from '@common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerModule } from '@nestjs/throttler';

import {
  AuthenticationsModule,
  BranchesModule,
  CaslModule,
  CustomersModule,
  DevicesModule,
  EmailSchedulesModule,
  HealthModule,
  PrismaModule,
  ProtocolModule,
  UsersModule,
  VehiclesModule,
} from '../modules';

export const imports: (
  | DynamicModule
  | Type<any>
  | Promise<DynamicModule>
  | ForwardReference<any>
)[] = [
  PrismaModule,
  DevicesModule,
  UsersModule,
  AuthenticationsModule,
  EmailSchedulesModule,
  ScheduleModule.forRoot(),
  EventEmitterModule.forRoot(),
  TerminusModule,
  WinstonModule.forRoot(winstonConfig),
  MailerModule.forRoot(mailerConfig),
  ConfigModule.forRoot(configOptions),
  BullModule.forRootAsync(asyncBullConfig),
  ThrottlerModule.forRootAsync(throttlerAsyncOptions),
  GraphQLModule.forRoot({
    autoSchemaFile: join(process.cwd(), 'schema.gql'),
    sortSchema: true,
    playground: true,
  }),
  HealthModule,
  CustomersModule,
  VehiclesModule,
  BranchesModule,
  CaslModule,
  ProtocolModule,
];
