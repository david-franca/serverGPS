import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [UsersService, PrismaService],
  imports: [ConfigModule],
})
export class UsersModule {}
