import { Logger, LoggerService } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Socket as TCPSocket } from 'net';
import { ProtocolName, ProtocolTypes } from '../interfaces/protocol.interface';
import { ProtocolHandler } from './protocol.model';

export abstract class AbstractGpsDevice extends EventEmitter {
  uid: string;
  socket: TCPSocket;
  logger: LoggerService;
  ip: string;
  port: number;
  protocol: ProtocolName;
  logged: boolean;
  adapter: ProtocolTypes;

  constructor(
    socket: TCPSocket,
    protocol: ProtocolName,
    logger?: LoggerService,
  ) {
    super({ captureRejections: true });
    this.socket = socket;
    this.logger = logger || Logger;
    this.protocol = protocol;
    this.ip = socket instanceof TCPSocket ? socket.remoteAddress : this.ip;
    this.port = socket instanceof TCPSocket ? socket.remotePort : this.port;
    this.adapter = new ProtocolHandler().handleProtocol(this.protocol, socket);
    this.socket.on('close', () => this.timeout());
    this.socket.on('data', this.handleData.bind(this));
    this.on('error', (err) =>
      this.logger.error(`[${this.getUID()}][${this.ip}:${this.port}]${err}`),
    );
  }

  protected timeout() {
    this.emit('disconnect', this.getUID());
  }

  getUID(): string {
    return this.uid;
  }

  async handleData(data: Buffer) {
    this.logger.debug(
      `[${this.getUID()}]Receiving raw data: ${data.toString('hex')}`,
    );
    const position = await this.adapter.decode(data);
    console.log(position);
    //TODO
  }
}
