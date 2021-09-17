import {
  DynamicModule,
  ForwardReference,
  LoggerService,
  Provider,
  Type,
} from '@nestjs/common';
import { Socket } from 'net';

import { Command, Position } from '../models';
import {
  GT06Protocol,
  GT06ProtocolDecoder,
  GT06ProtocolEncoder,
} from '../protocols/gt06';
import {
  SuntechProtocol,
  SuntechProtocolDecoder,
  SuntechProtocolEncoder,
} from '../protocols/suntech';

export interface ConfigInterface {
  port: number;
  protocol: ProtocolName;
}

export type ProtocolName = 'GT06' | 'SUNTECH';

export type ProtocolDecoderTypes = SuntechProtocolDecoder | GT06ProtocolDecoder;

export type ProtocolEncoderTypes = SuntechProtocolEncoder | GT06ProtocolEncoder;

export type Protocols = SuntechProtocol | GT06Protocol;

export interface Options {
  config: ConfigInterface[];
  logger?: Type<LoggerService>;
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  providers?: Provider[];
  host?: string;
}

export interface AdapterInterface {
  decode(msg: Buffer): Promise<Position>;
  getPrefix(): string;
}

export interface Protocol {
  getName(): string;
  getServerList(): Set<any>;
  getSupportedDataCommands(): Set<string>;
  getSupportedTextCommands(): Set<string>;
  sendTextCommand(destAddress: string, command: Command): void;
  sendDataCommand(
    channel: Socket,
    remoteAddress: string,
    command: Command,
  ): void;
}
