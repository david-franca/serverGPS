import { Request } from 'express';
import { Socket as TCPSocket } from 'net';
import { Socket as SocketIO } from 'socket.io';

import {
  DynamicModule,
  ForwardReference,
  LoggerService,
  Provider,
  Type,
} from '@nestjs/common';
import { User } from '@prisma/client';

import {
  GT06Protocol,
  GT06ProtocolDecoder,
  GT06ProtocolEncoder,
} from '../modules/tcp/gt06';
import { Command, Position } from '../modules/tcp/models';
import {
  SuntechProtocol,
  SuntechProtocolDecoder,
  SuntechProtocolEncoder,
} from '../modules/tcp/suntech';

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
    channel: TCPSocket,
    remoteAddress: string,
    command: Command,
  ): void;
}

export type Environments =
  | 'DATABASE_URL'
  | 'REDIS_HOST'
  | 'REDIS_PORT'
  | 'REDIS_PASSWORD'
  | 'SALT_NUMBER'
  | 'EMAIL_HOST'
  | 'EMAIL_USER'
  | 'EMAIL_PASSWORD'
  | 'EMAIL_PORT'
  | 'CORS_HOST'
  | 'SERVER_PORT'
  | 'SESSION_SECRET'
  | 'THROTTLE_TTL'
  | 'THROTTLE_LIMIT'
  | 'ADMIN_PASS'
  | 'SENTRY_DNS';

export interface RequestWithUser extends Request {
  user: User;
}

export interface AuthenticatedSocket extends SocketIO {
  auth: any;
}
