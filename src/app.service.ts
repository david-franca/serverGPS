import {
  Inject,
  Injectable,
  LoggerService,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { EventEmitter } from 'events';
import { Options } from './interfaces/options.interface';
import { Server as TCPServer, Socket as TCPSocket, createServer } from 'net';

@Injectable()
export class AppService
  extends EventEmitter
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  protected options: Options;
  protected logger: LoggerService;
  protected tcp: TCPServer;

  constructor(
    @Inject('GPS_CONFIG_OPTIONS') options: Options,
    @Inject('GPS_LOGGER') logger: LoggerService,
  ) {
    super({ captureRejections: true });
    this.options = options;
    this.options.host = options.host ?? '0.0.0.0';
    this.logger = logger;
  }

  handleConnection(socket: TCPSocket) {
    this.logger.debug(
      `Incoming connection from ${socket.remoteAddress}:${socket.remotePort}`,
      'NewConnection',
    );
  }

  async onApplicationBootstrap() {
    this.options.port.forEach((port) => {
      this.tcp = createServer(this.handleConnection.bind(this)).listen({
        host: this.options.host,
        port,
      });
      this.logger.log(
        `The TCP server is listening on ${this.options.host}:${port}`,
        'AppService',
      );
    });
  }

  onApplicationShutdown() {
    this.on('error', this.onPromiseError.bind(this));
    this.tcp.removeAllListeners();
    this.tcp.close();
  }

  onPromiseError(error: any) {
    this.logger.error(error);
  }
}
