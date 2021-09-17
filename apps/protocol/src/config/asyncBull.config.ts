import { SharedBullAsyncConfiguration } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Environments } from '@types';

export const asyncBullConfig: SharedBullAsyncConfiguration = {
  imports: [ConfigModule],
  useFactory: async (
    configService: ConfigService<Record<Environments, any>>,
  ) => ({
    redis: {
      host: configService.get('REDIS_HOST'),
      port: configService.get('REDIS_PORT'),
      password: configService.get('REDIS_PASSWORD'),
    },
  }),
  inject: [ConfigService],
};
