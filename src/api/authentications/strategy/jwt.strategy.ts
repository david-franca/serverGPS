import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from 'src/api/users/users.service';
import { ConfigService } from 'src/config/config.service';
import { TokenPayload } from '../interface/tokenPayload.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_PUBLIC_KEY'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.findOne(payload.userId);
  }
}
