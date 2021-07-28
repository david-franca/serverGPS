import {
  GT06Protocol,
  GT06ProtocolDecoder,
  GT06ProtocolEncoder,
} from '../../protocols/gt06';
import {
  SuntechProtocol,
  SuntechProtocolDecoder,
  SuntechProtocolEncoder,
} from '../../protocols/suntech';

export type ProtocolName = 'GT06' | 'SUNTECH';

export type ProtocolDecoderTypes = SuntechProtocolDecoder | GT06ProtocolDecoder;

export type ProtocolEncoderTypes = SuntechProtocolEncoder | GT06ProtocolEncoder;

export type Protocols = SuntechProtocol | GT06Protocol;
