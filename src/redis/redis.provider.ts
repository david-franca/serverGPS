import { Provider } from '@nestjs/common';
import { RedisClient } from 'redis';
import { pubClient, subClient } from '../state/state.adapter';
import { REDIS_CONSTANTS } from './redis.enum';

export const redisProviders: Provider[] = [
  {
    useFactory: (): RedisClient => {
      return subClient;
    },
    provide: REDIS_CONSTANTS.REDIS_SUBSCRIBER_CLIENT,
  },
  {
    useFactory: (): RedisClient => {
      return pubClient;
    },
    provide: REDIS_CONSTANTS.REDIS_PUBLISHER_CLIENT,
  },
];
