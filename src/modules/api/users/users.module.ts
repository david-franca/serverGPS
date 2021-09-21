import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, PrismaService],
  imports: [ConfigModule],
})
export class UsersModule {}
