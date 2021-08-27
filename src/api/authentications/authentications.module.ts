import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Environments } from '../../interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthenticationsController } from './authentications.controller';
import { AuthenticationsService } from './authentications.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/refreshToken.strategy';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService<Record<Environments, string>>,
      ) => ({
        privateKey: configService.get('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
        publicKey: configService.get('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
        signOptions: {
          expiresIn: `${configService.get(
            'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
          )}s`,
          issuer: 'https://meu-site.com.br',
          algorithm: 'RS256',
        },
      }),
    }),
  ],
  controllers: [AuthenticationsController],
  providers: [
    AuthenticationsService,
    PrismaService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthenticationsModule {}
