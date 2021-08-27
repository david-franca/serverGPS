import { Socket as TCPSocket } from 'net';

import { BaseProtocol } from '../';
import { Command } from '../../models';
import { SuntechProtocolDecoder, SuntechProtocolEncoder } from './';

export class SuntechProtocol extends BaseProtocol {
  private encoder: SuntechProtocolEncoder;
  private decoder: SuntechProtocolDecoder;
  constructor(socket: TCPSocket) {
    super();
    this.setSupportedDataCommands(
      Command.TYPE_OUTPUT_CONTROL,
      Command.TYPE_REBOOT_DEVICE,
      Command.TYPE_POSITION_SINGLE,
      Command.TYPE_ENGINE_STOP,
      Command.TYPE_ENGINE_RESUME,
      Command.TYPE_ALARM_ARM,
      Command.TYPE_ALARM_DISARM,
    );
    this.decoder = new SuntechProtocolDecoder(socket);
    this.encoder = new SuntechProtocolEncoder();
    this.addServer(SuntechProtocolDecoder, SuntechProtocolEncoder);
  }

  getDecoder() {
    return this.decoder;
  }

  getEncoder() {
    return this.encoder;
  }
}
