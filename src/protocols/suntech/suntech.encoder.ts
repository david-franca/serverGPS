import { Socket as TCPSocket } from 'net';

import { SuntechProtocolDecoder } from './suntech.decoder';

export class SuntechProtocolEncoder {
  /**
   * getPrefix
   */
  public getPrefix(channel: TCPSocket) {
    let prefix = 'SA200CMD';
    if (channel) {
      const protocolDecoder: SuntechProtocolDecoder = null;

      if (protocolDecoder) {
        const decoderPrefix = protocolDecoder.getPrefix();
        if (decoderPrefix) {
          prefix = decoderPrefix.substring(0, decoderPrefix.length - 3) + 'CMD';
        }
      }
    }
    return prefix;
  }
}
