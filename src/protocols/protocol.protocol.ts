import { Socket as TCPSocket } from 'net';

import { ProtocolName } from '../@types/protocol';
import { GT06Protocol } from './gt06';
import { SuntechProtocol } from './suntech';

export class Protocol {
  private name: ProtocolName;
  private socket: TCPSocket;

  constructor(name: ProtocolName, socket: TCPSocket) {
    this.name = name;
    this.socket = socket;
  }

  protocol() {
    switch (this.name) {
      case 'SUNTECH':
        return new SuntechProtocol(this.socket);
      case 'GT06':
        return new GT06Protocol(this.socket);
    }
  }
}
