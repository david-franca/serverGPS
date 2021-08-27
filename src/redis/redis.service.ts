import { RedisClient } from 'redis';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Inject, Injectable } from '@nestjs/common';

import { REDIS_CONSTANTS } from './redis.enum';

export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CONSTANTS.REDIS_SUBSCRIBER_CLIENT)
    private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_CONSTANTS.REDIS_PUBLISHER_CLIENT)
    private readonly redisPublisherClient: RedisClient,
  ) {}

  public fromEvent<T>(eventName: string): Observable<T> {
    this.redisSubscriberClient.subscribe(eventName);

    return new Observable((observer: Observer<RedisSubscribeMessage>) =>
      this.redisSubscriberClient.on('message', (channel, message) =>
        observer.next({ channel, message }),
      ),
    ).pipe(
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }

  public async publish(channel: string, value: unknown): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(
        channel,
        JSON.stringify(value),
        (error, reply) => {
          if (error) {
            return reject(error);
          }

          return resolve(reply);
        },
      );
    });
  }
}
