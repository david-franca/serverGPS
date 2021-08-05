import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PrismaModule } from '../../prisma/prisma.module';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { Environments } from './interface/environments.interface';
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
            JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
            JWT_ACCESS_TOKEN_PUBLIC_KEY: Joi.string().required(),
          }),
        }),
        PrismaModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService<Record<Environments, string>>,
          ) => ({
            publicKey: configService.get('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
            signOptions: {
              expiresIn: `${configService.get(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
              )}s`,
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

    authenticationService = module.get<AuthenticationsService>(
      AuthenticationsService,
    );
  });

  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const userId = 'ebc282b9-dceb-4d8e-8c37-b914064ace6e';
      const name = 'David';
      const username = 'david.franca';
      const role = 'ADMIN';
      expect(
        typeof authenticationService.getCookieWithJwtAccessToken(
          userId,
          name,
          username,
          role,
        ),
      ).toEqual('object');
    });
  });

  it('should be defined', () => {
    expect(authenticationService).toBeDefined();
  });
});
