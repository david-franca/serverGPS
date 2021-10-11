import { compare, hash } from 'bcrypt';
import { Response } from 'express';

import { PrismaError } from '@common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CookiesProps, Environments, TokenPayload } from '@types';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Record<Environments, any>>,
  ) {}

  async register(registrationData: RegisterDto) {
    const hashedPassword = await hash(
      registrationData.password,
      this.configService.get('SALT_NUMBER'),
    );

    try {
      const createUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      delete createUser.password;
      return createUser;
    } catch (error) {
      if (error.code === PrismaError.UniqueConstraintViolation) {
        throw new ConflictException('User with that username already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async getAuthenticatedUser(username: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findByUsername(username);

      await this.verifyPassword(plainTextPassword, user.password);

      delete user.password;
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public getCookieWithJwtAccessToken(
    userId: string,
    name: string,
    username: string,
    role: string,
  ) {
    const payload: TokenPayload = { name, username, role };

    // SIGNING OPTIONS
    const signOptions: JwtSignOptions = {
      subject: userId,
      privateKey: this.configService.get('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
    };

    const token = this.jwtService.sign(payload, signOptions);
    const maxAge =
      Number(this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')) * 1000;

    return {
      token,
      maxAge,
      key: 'Authentication',
    };
  }

  public getCookieWithJwtRefreshToken(
    userId: string,
    name: string,
    username: string,
    role: string,
  ) {
    const payload: TokenPayload = { name, username, role };

    const maxAge =
      Number(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')) *
      1000;

    // SIGNING OPTIONS
    const signOptions: JwtSignOptions = {
      expiresIn: `${maxAge / 1000}s`,
      privateKey: this.configService.get('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
      subject: userId,
    };

    const token = this.jwtService.sign(payload, signOptions);
    return {
      maxAge,
      token,
      key: 'Refresh',
    };
  }

  public async getUserFromAuthenticationToken(token: string) {
    if (!token) {
      return null;
    }
    const payload: TokenPayload = this.jwtService.verify(token);
    if (payload.username) {
      return await this.usersService.findByUsername(payload.username);
    }
  }

  public deleteCookies(res: Response, cookies: Record<string, string>) {
    const keys = Object.keys(cookies);
    keys.forEach((key) => {
      res.clearCookie(key, {
        httpOnly: true,
        sameSite: 'none',
      });
    });
  }

  public setCookies(res: Response, options: CookiesProps[]) {
    options.forEach((opt) => {
      const { key, maxAge, token } = opt;
      res.cookie(key, token, {
        httpOnly: true,
        maxAge,
        sameSite: 'none',
      });
    });
  }
}
