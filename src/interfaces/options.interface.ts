import {
  DynamicModule,
  ForwardReference,
  LoggerService,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigInterface } from '.';

export interface Options {
  config: ConfigInterface[];
  logger?: Type<LoggerService>;
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
  host?: string;
}
