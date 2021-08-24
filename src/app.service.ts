import {
  Inject,
  Injectable,
  LoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Options, ConfigInterface } from './interfaces';
import { Server as TCPServer, Socket as TCPSocket, createServer } from 'net';
import { GpsDevice, AbstractGpsDevice } from './models';
import { ProtocolName } from './@types/protocol';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  protected options: Options;
  protected logger: LoggerService;
  protected tcp: TCPServer;
  protected devices: Array<AbstractGpsDevice>;
  protected config: ConfigInterface[];

  constructor(
    @Inject('GPS_CONFIG_OPTIONS') options: Options,
    @Inject('GPS_LOGGER') logger: LoggerService,
    private eventEmitter: EventEmitter2,
  ) {
    this.options = options;
    this.options.host = '0.0.0.0';
    this.logger = logger;
    this.devices = [];
    this.config = options.config;
  }

  handleConnection(socket: TCPSocket, protocol: ProtocolName) {
    this.logger.debug(
      `Incoming connection from ${socket.remoteAddress}:${socket.remotePort}`,
      protocol,
    );
    const device = new GpsDevice(
      socket,
      protocol,
      this.logger,
      this.eventEmitter,
    );
    this.devices.push(device);

    setTimeout(() => {
      if (!device.logged) {
        socket.end();
      }
    }, 30000);
  }

  @OnEvent('disconnect')
  handleDisconnect(uid: string) {
    const index = this.devices.findIndex(
      (device: AbstractGpsDevice, index: number) => {
        if (device.getUID() === uid) {
          this.devices.splice(index, 1);
          return true;
        }
      },
    );
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
            'AppService',
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

  onPromiseError(error: any) {
    this.logger.error(error);
  }
}
