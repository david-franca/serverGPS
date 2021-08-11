import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environments } from '../authentications/interface/environments.interface';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, PrismaService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<Record<Environments, string | number>>,
      ) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 120,
        password: configService.get('REDIS_PASSWORD'),
      }),
    }),
  ],
})
export class DevicesModule {}
