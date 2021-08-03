import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { ConfigService } from '../../config/config.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

describe('AuthenticationsService', () => {
  let authenticationService: AuthenticationsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        ConfigModule.forRoot({
          validationSchema: Joi.object({
            DATABASE_URL: Joi.string().required(),
            JWT_SECRET: Joi.string().required(),
            JWT_EXPIRATION_TIME: Joi.string().required(),
            JWT_PRIVATE_KEY: Joi.string().required(),
            JWT_PUBLIC_KEY: Joi.string().required(),
          }),
        }),
        PrismaModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            privateKey: configService.get('JWT_PRIVATE_KEY'),
            publicKey: configService.get('JWT_PUBLIC_KEY'),
            signOptions: {
              expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
              issuer: 'David França',
              algorithm: 'RS256',
            },
          }),
        }),
      ],
      providers: [
        AuthenticationsService,
        PrismaService,
        UsersService,
        LocalStrategy,
        JwtStrategy,
      ],
      controllers: [AuthenticationsController],
    }).compile();

    authenticationService = await module.get<AuthenticationsService>(
      AuthenticationsService,
    );
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 'e6508213-670a-4c68-b757-bb765246003c';
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual('string');
    });
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });
});
