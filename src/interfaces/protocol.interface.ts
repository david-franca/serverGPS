import { Socket } from 'net';
import { Command } from 'src/models/command.model';
import { GT06ProtocolDecoder } from 'src/protocols/gt06.decoder';
import { SuntechProtocolDecoder } from 'src/protocols/suntech.decoder';
import { LinkedList } from 'src/structure/LinkedList';

export interface Protocol {
  getName(): string;
  getServerList(): LinkedList<any>;
  getSupportedDataCommands(): Set<string>;
  getSupportedTextCommands(): Set<string>;
  sendTextCommand(destAddress: string, command: Command): void;
  sendDataCommand(
    channel: Socket,
    remoteAddress: string,
    command: Command,
  ): void;
}

export type ProtocolName = 'GT06' | 'SUNTECH';

export type ProtocolTypes = SuntechProtocolDecoder | GT06ProtocolDecoder;
