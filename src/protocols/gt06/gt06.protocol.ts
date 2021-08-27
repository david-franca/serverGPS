import { Socket as TCPSocket } from 'net';

import { BaseProtocol } from '../';
import { GT06ProtocolDecoder, GT06ProtocolEncoder } from './';

export class GT06Protocol extends BaseProtocol {
  private encoder: GT06ProtocolEncoder;
  private decoder: GT06ProtocolDecoder;
  constructor(socket: TCPSocket) {
    super();
    this.decoder = new GT06ProtocolDecoder(socket);
    this.encoder = new GT06ProtocolEncoder();
  }

  getDecoder() {
    return this.decoder;
  }

  getEncoder() {
    return this.encoder;
  }
}
