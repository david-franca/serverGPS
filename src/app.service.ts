import { createServer, Server as TCPServer, Socket as TCPSocket } from 'net';

import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

import { ProtocolName } from './@types/protocol';
import { ConfigInterface, Options } from './interfaces';
import { GpsDevice } from './models';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  protected options: Options;
  private readonly logger = new Logger(this.constructor.name);
  protected tcp: TCPServer;
  protected devices: Array<GpsDevice>;
  protected config: ConfigInterface[];

  constructor(
    @Inject('GPS_CONFIG_OPTIONS') options: Options,

    private eventEmitter: EventEmitter2,
  ) {
    this.options = options;
    this.options.host = '0.0.0.0';
    this.devices = [];
    this.config = options.config;
  }

  handleConnection(socket: TCPSocket, protocol: ProtocolName) {
    this.logger.debug(
      `Incoming connection from ${socket.remoteAddress}:${socket.remotePort}`,
      protocol,
    );
    const device = new GpsDevice(socket, protocol, this.eventEmitter);
    this.devices.push(device);

    setTimeout(() => {
      if (!device.logged) {
        socket.end();
      }
    }, 30000);
  }

  @OnEvent('disconnect')
  handleDisconnect(uid: string) {
    const index = this.devices.findIndex((device: GpsDevice, index: number) => {
      if (device.getUID() === uid) {
        this.devices.splice(index, 1);
        return true;
      }
    });
    if (index < 0) return;
    this.logger.debug(`Device ${uid} disconnected.`);
    this.eventEmitter.emit('disconnected');
  }

  async onApplicationBootstrap() {
    this.config.forEach(({ port, protocol }) => {
      this.tcp = createServer((socket) =>
        this.handleConnection(socket, protocol),
      ).listen(
        {
          host: this.options.host,
          port,
        },
        () => {
          this.logger.debug(
            `The TCP server is listening on ${this.options.host}:${port} over ${protocol} protocol`,
          );
        },
      );
    });
  }

  onApplicationShutdown() {
    this.eventEmitter.on('error', this.onPromiseError.bind(this));
    this.tcp.removeAllListeners();
    this.tcp.close();
  }

  onPromiseError(error: Error) {
    this.logger.error(error);
  }
}
