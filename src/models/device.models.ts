import { LoggerService } from '@nestjs/common';
import { Socket as TCPSocket } from 'net';
import { ProtocolName } from 'src/interfaces/protocol.interface';
import { AbstractGpsDevice } from './abstract_device.model';

export class GpsDevice extends AbstractGpsDevice {
  uid: string;
  socket: TCPSocket;
  logger: LoggerService;
  ip: string;
  port: number;
  protocol: ProtocolName;
  logged: boolean;
  adapter: any;

  constructor(
    socket: TCPSocket,
    protocol: ProtocolName,
    logger: LoggerService,
  ) {
    super(socket, protocol, logger);
  }

  getUID(): string {
    return this.uid;
  }

  login(canLogin: boolean) {
    if (!canLogin) {
      this.logger.warn(
        `Device ${this.getUID()} not authorized. Login request was rejected. IP ${
          this.ip
        }`,
      );
      const loginFailEvent = {
        uid: this.getUID(),
        ip: this.ip,
      };
      this.emit('login_fail', loginFailEvent);
      return;
    }
  }
}
