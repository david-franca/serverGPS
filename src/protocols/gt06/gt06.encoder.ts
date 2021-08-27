import { Socket as TCPSocket } from 'net';

import { GT06ProtocolDecoder } from './';

export class GT06ProtocolEncoder {
  /**
   * getPrefix
   */
  public getPrefix(channel: TCPSocket) {
    let prefix = 'SA200CMD';
    if (channel) {
      const protocolDecoder: GT06ProtocolDecoder = null;

      if (protocolDecoder) {
        const decoderPrefix = 'sufixo';
        if (decoderPrefix) {
          prefix = decoderPrefix.substring(0, decoderPrefix.length - 3) + 'CMD';
        }
      }
    }
    return prefix;
  }
}
