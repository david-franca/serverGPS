import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { LocalSerializer } from './strategy/local.serializer';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [PassportModule, UsersModule, ConfigModule],
  controllers: [AuthenticationsController],
  providers: [
    AuthenticationsService,
    PrismaService,
    UsersService,
    LocalSerializer,
    LocalStrategy,
  ],
})
export class AuthenticationsModule {}
