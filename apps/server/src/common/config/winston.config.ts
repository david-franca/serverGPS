import { utilities, WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike(),
      ),
    }),
    new winston.transports.File({
      level: 'info',
      filename: 'application.log',
      dirname: 'logs',
    }),
    new winston.transports.File({
      level: 'error',
      filename: 'error.log',
      dirname: 'logs',
      format: winston.format.json(),
    }),
  ],
};
