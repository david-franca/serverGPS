import { Module } from '@nestjs/common';
import { SocketsService } from './sockets.service';
import { SocketsGateway } from './sockets.gateway';
import { AuthenticationsService } from '../api/authentications/authentications.service';
import { UsersService } from '../api/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { Environments } from '../interfaces';

@Module({
  providers: [
    SocketsGateway,
    SocketsService,
    AuthenticationsService,
    UsersService,
  ],
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
})
export class SocketsModule {}
