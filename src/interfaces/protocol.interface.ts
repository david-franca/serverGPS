import { Socket } from 'net';
import { Command } from 'src/models/command.model';
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
