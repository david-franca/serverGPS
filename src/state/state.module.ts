import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationsService } from '../api/authentications/authentications.service';
import { UsersService } from '../api/users/users.service';
import { Environments } from '../interfaces';
import { PrismaModule } from '../prisma/prisma.module';
import { StateService } from './state.service';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
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
  providers: [StateService, AuthenticationsService, UsersService],
  exports: [StateService],
})
export class StateModule {}
