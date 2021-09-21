import { Protocol } from '@types';

import { Command } from './models';

export abstract class BaseProtocol implements Protocol {
  private name: string;
  private supportedDataCommands: Set<string> = new Set();
  private supportedTextCommands: Set<string> = new Set();
  private serverList: Set<any[]> = new Set();

  private textCommandEncoder = null;

  constructor() {
    this.name = BaseProtocol.nameFromClass(BaseProtocol.name);
  }

  public static nameFromClass(className: string) {
    return className.substring(0, className.length - 8).toLowerCase();
  }

  public getName() {
    return this.name;
  }

  protected addServer(...server) {
    this.serverList.add(server);
  }

  public getServerList() {
    return this.serverList;
  }

  public setSupportedDataCommands(...commands: string[]) {
    commands.forEach((command) => {
      this.supportedDataCommands.add(command);
    });
  }

  public setSupportedTextCommands(...commands: string[]) {
    commands.forEach((command) => {
      this.supportedTextCommands.add(command);
    });
  }

  public getSupportedDataCommands() {
    const commands: Set<string> = new Set(this.supportedDataCommands);
    commands.add(Command.TYPE_CUSTOM);
    return commands;
  }

  public getSupportedTextCommands() {
    const commands: Set<string> = new Set(this.supportedTextCommands);
    commands.add(Command.TYPE_CUSTOM);
    return commands;
  }

  public sendDataCommand(
    channel,
    remoteAddress: string,
    command: Command,
  ): void {
    // TODO
  }

  public setTextCommandEncoder(textCommandEncoder) {
    this.textCommandEncoder = textCommandEncoder;
  }

  public sendTextCommand(destAddress, command): void {
    //TODO
  }
}
