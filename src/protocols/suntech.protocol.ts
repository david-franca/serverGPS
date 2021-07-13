import { Command } from 'src/models/command.model';
import { BaseProtocol } from './base.protocol';

export class SuntechProtocol extends BaseProtocol {
  constructor() {
    super();
    this.setSupportedDataCommands(
      Command.TYPE_OUTPUT_CONTROL,
      Command.TYPE_REBOOT_DEVICE,
      Command.TYPE_POSITION_SINGLE,
      Command.TYPE_ENGINE_STOP,
      Command.TYPE_ENGINE_RESUME,
      Command.TYPE_ALARM_ARM,
      Command.TYPE_ALARM_DISARM,
    );
    this.addServer('');
  }
}
