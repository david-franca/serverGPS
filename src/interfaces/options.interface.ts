import {
  DynamicModule,
  ForwardReference,
  LoggerService,
  Provider,
  Type,
} from '@nestjs/common';

export interface Options {
  port: Array<number>;
  logger?: Type<LoggerService>;
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
  host?: string;
}
