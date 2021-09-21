import {
  existsSync,
  mkdirSync,
  PathLike,
  readFileSync,
  writeFileSync,
} from 'fs';
import { homedir } from 'os';
import { join } from 'path';

export class ConfigService {
  private config: { [key: string]: any } = null;
  private path: string;

  constructor(options: { defaults: any }) {
    this.path = join(
      process.env.APPDATA ||
        (process.platform == 'darwin'
          ? homedir() + '/Library/Preferences'
          : homedir() + '/.local/share'),
      '.gpsServer',
    );
    this.verifyPath();
    this.config = this.parseDataFile(
      `${this.path}/config.json`,
      options.defaults,
    );
  }

  public get(key: string): any {
    return this.config[key];
  }

  public set(key: string, value: any) {
    this.config[key] = value;
    writeFileSync(`${this.path}/config.json`, JSON.stringify(this.config));
  }

  private verifyPath() {
    if (!existsSync(this.path)) {
      mkdirSync(this.path);
    }
  }

  private parseDataFile(filePath: PathLike, defaults: any) {
    try {
      return JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (error) {
      return defaults;
    }
  }
}
