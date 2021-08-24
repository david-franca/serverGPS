import { Logger, LoggerService } from '@nestjs/common';
import { Socket as TCPSocket } from 'net';
import { PositionService } from '../services/position/position.service';
import {
  ProtocolDecoderTypes,
  ProtocolEncoderTypes,
  ProtocolName,
  Protocols,
} from '../@types/protocol';
import { Protocol } from '../protocols';
import { EventEmitter2 } from '@nestjs/event-emitter';

export abstract class AbstractGpsDevice {
  private service: PositionService = new PositionService();
  uid: string;
  socket: TCPSocket;
  logger: LoggerService;
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
    logger: LoggerService,
    eventEmitter: EventEmitter2,
  ) {
    this.socket = socket;
    this.eventEmitter = eventEmitter;
    this.logger = logger || Logger;
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

  async handleData(data: Buffer) {
    const position = await this.decoder.decode(data);
    this.login(!!position);
    if (position) {
      this.uid = position.getDeviceId();
      this.eventEmitter.emit('positions.received', position);
      // console.log('Handle Data =>', position);
      // this.logger.debug(`[${this.getUID()}]Receiving raw data: ${data}`);
    }
    //TODO
  }

  abstract login(canLogin: boolean): void;
  abstract logout(): Promise<void>;
}
