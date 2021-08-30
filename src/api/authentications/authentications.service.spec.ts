import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';

describe('AuthenticationsService', () => {
  let authenticationService: AuthenticationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            DATABASE_URL: Joi.string().required(),
            JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
            JWT_ACCESS_TOKEN_PUBLIC_KEY: Joi.string().required(),
          }),
        }),
        PrismaModule,
      ],
      providers: [AuthenticationsService, PrismaService, UsersService],
      controllers: [AuthenticationsController],
    }).compile();

    authenticationService = module.get<AuthenticationsService>(
      AuthenticationsService,
    );
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });
});
