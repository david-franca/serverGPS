import { Socket } from 'net';

import { Command } from '../models';

export interface Protocol {
  getName(): string;
  getServerList(): Set<any>;
  getSupportedDataCommands(): Set<string>;
  getSupportedTextCommands(): Set<string>;
  sendTextCommand(destAddress: string, command: Command): void;
  sendDataCommand(
    channel: Socket,
    remoteAddress: string,
    command: Command,
  ): void;
}
