import { SuntechProtocolDecoder } from '../protocols/suntech.decoder';
import { Socket as TCPSocket } from 'net';

import { ProtocolName, ProtocolTypes } from '../interfaces/protocol.interface';
import { GT06ProtocolDecoder } from '../protocols/gt06.decoder';

export class ProtocolHandler {
  handleProtocol(protocol: ProtocolName, socket: TCPSocket): ProtocolTypes {
    let adapter: ProtocolTypes;
    switch (protocol) {
      case 'SUNTECH':
        adapter = new SuntechProtocolDecoder(socket);
        break;
      case 'GT06':
        adapter = new GT06ProtocolDecoder(socket);
    }
    return adapter;
  }
}
