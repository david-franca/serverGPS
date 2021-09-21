import { utilities, WinstonModuleOptions } from 'nest-winston';
import { config, format, transports } from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  levels: config.npm.levels,
  level: 'verbose',
  transports: [
    new transports.Console({
      format: format.combine(format.timestamp(), utilities.format.nestLike()),
    }),
    new transports.File({
      level: 'info',
      filename: 'application.log',
      dirname: 'logs',
    }),
    new transports.File({
      level: 'error',
      filename: 'error.log',
      dirname: 'logs',
      format: format.json(),
    }),
  ],
};
