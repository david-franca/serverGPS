import * as redisStore from 'cache-manager-redis-store';

import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environments } from '@types';

import { PrismaModule } from '../../prisma/prisma.module';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports: [
    PrismaModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<Record<Environments, string | number>>,
      ) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 60,
        password: configService.get('REDIS_PASSWORD'),
      }),
    }),
  ],
})
export class DevicesModule {}
