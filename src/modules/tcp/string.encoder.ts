import { Command } from './models';

interface ValueFormatter {
  formatValue(key: string, value): string;
}

export abstract class StringProtocolEncoder {
  protected formatCommand(
    command: Command,
    format: string,
    valueFormatter: ValueFormatter = null,
    ...keys: string[]
  ): string {
    const values = new String[keys.length]();
    for (let i = 0; i < keys.length; i++) {
      let value: string = null;
      if (keys[i].includes(Command.KEY_UNIQUE_ID)) {
        value = ''; // this.getUniqueId(command.getDeviceId());
      } else {
        const object = command.getAttributes().get(keys[i]);
        if (valueFormatter != null) {
          value = valueFormatter.formatValue(keys[i], object);
        }
        if (value == null && object != null) {
          value = object.toString();
        }
        if (value == null) {
          value = '';
        }
      }
      values[i] = value;
    }

    return '';
  }
}
