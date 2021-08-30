import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerAsyncOptions } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';
import { Environments } from '../interfaces';

export const throttlerAsyncOptions: ThrottlerAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService<Record<Environments, any>>) => ({
    ttl: config.get('THROTTLE_TTL'),
    limit: config.get('THROTTLE_LIMIT'),
    storage: new ThrottlerStorageRedisService({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      password: config.get('REDIS_PASSWORD'),
    }),
  }),
};
