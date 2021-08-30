import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthenticationsService } from '../api/authentications/authentications.service';
import { UsersService } from '../api/users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SocketsGateway } from './sockets.gateway';
import { SocketsService } from './sockets.service';

@Module({
  providers: [
    SocketsGateway,
    SocketsService,
    AuthenticationsService,
    UsersService,
  ],
  imports: [ConfigModule, PrismaModule],
})
export class SocketsModule {}
