import { LoggerService } from '@nestjs/common';
import { Socket as TCPSocket } from 'net';
import { ProtocolName } from '../@types/protocol';
import { AbstractGpsDevice } from '.';
import { EventEmitter2 } from 'eventemitter2';

export class GpsDevice extends AbstractGpsDevice {
  constructor(
    socket: TCPSocket,
    protocol: ProtocolName,
    logger: LoggerService,
    eventEmitter: EventEmitter2,
  ) {
    super(socket, protocol, logger, eventEmitter);
    this.eventEmitter = eventEmitter;
  }

  login(canLogin: boolean): void {
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
      this.eventEmitter.emit('loginFail', loginFailEvent);
      return;
    }
    this.logged = true;
  }

  async logout(): Promise<void> {
    this.logged = false;
    try {
      this.decoder.requestLogout();
    } catch (err) {
      this.eventEmitter.emit('error', err);
    }
  }
}
