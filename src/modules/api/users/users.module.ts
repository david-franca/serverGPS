import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from '../../prisma/prisma.module';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  imports: [ConfigModule, PrismaModule],
})
export class UsersModule {}
