import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthenticationsService } from '../api/authentications/authentications.service';
import { UsersService } from '../api/users/users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StateService } from './state.service';

@Module({
  imports: [ConfigModule, PrismaModule],
  providers: [StateService, AuthenticationsService, UsersService],
  exports: [StateService],
})
export class StateModule {}
