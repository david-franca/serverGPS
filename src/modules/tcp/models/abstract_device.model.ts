import { Socket as TCPSocket } from 'net';

import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Protocol } from '../';
import {
  ProtocolDecoderTypes,
  ProtocolEncoderTypes,
  ProtocolName,
  Protocols,
} from '../../../@types';

export abstract class AbstractGpsDevice {
  uid: string;
  socket: TCPSocket;
  readonly logger = new Logger(this.constructor.name);
  ip: string;
  port: number;
  protocolName: ProtocolName;
  protocol: Protocols;
  logged: boolean;
  decoder: ProtocolDecoderTypes;
  encoder: ProtocolEncoderTypes;
  eventEmitter: EventEmitter2;

  constructor(
    socket: TCPSocket,
    protocolName: ProtocolName,
    eventEmitter: EventEmitter2,
  ) {
    this.socket = socket;
    this.eventEmitter = eventEmitter;
    this.protocolName = protocolName;
    this.ip = socket instanceof TCPSocket ? socket.remoteAddress : this.ip;
    this.port = socket instanceof TCPSocket ? socket.remotePort : this.port;
    this.protocol = new Protocol(protocolName, socket).protocol();
    this.decoder = this.protocol.getDecoder();
    this.encoder = this.protocol.getEncoder();
    this.socket.on('close', () => this.timeout());
    this.socket.on('data', this.handleData.bind(this));
    this.eventEmitter.on('error', (err) =>
      this.logger.error(`[${this.getUID()}][${this.ip}:${this.port}]${err}`),
    );
  }

  protected timeout() {
    this.eventEmitter.emit('disconnect', this.getUID());
  }

  getUID(): string {
    return this.uid;
  }

  async handleData(data: Buffer): Promise<void> {
    const position = await this.decoder.decode(data);
    this.login(!!position);
    if (position) {
      this.uid = position.getDeviceId();
      this.eventEmitter.emit('BD.Positions.Class', position);
    }
  }

  abstract login(canLogin: boolean): void;
  abstract logout(): Promise<void>;
}
