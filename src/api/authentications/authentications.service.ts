import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { hash, compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenPayload } from './interface/tokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import { Environments } from './interface/environments.interface';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<Record<Environments, string>>,
  ) {}

  async register(registrationData: RegisterDto) {
    const hashedPassword = await hash(registrationData.password, 10);

    try {
      const createUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      createUser.password = undefined;
      return createUser;
    } catch (error) {
      if (error.code === PrismaError.UniqueConstraintViolation) {
        throw new HttpException(
          'User with that username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAuthenticatedUser(username: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.findByUsername(username);

      await this.verifyPassword(plainTextPassword, user.password);

      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtAccessToken(
    userId: string,
    name: string,
    username: string,
    role: string,
  ): string {
    const payload: TokenPayload = { name, username, role };

    // SIGNING OPTIONS
    const signOptions: JwtSignOptions = {
      subject: userId,
      privateKey: this.configService.get('JWT_ACCESS_TOKEN_PRIVATE_KEY'),
    };

    const token = this.jwtService.sign(payload, signOptions);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;
  }

  public getCookieWithJwtRefreshToken(
    userId: string,
    name: string,
    username: string,
    role: string,
  ) {
    const payload: TokenPayload = { name, username, role };

    // SIGNING OPTIONS
    const signOptions: JwtSignOptions = {
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
      privateKey: this.configService.get('JWT_REFRESH_TOKEN_PRIVATE_KEY'),
      subject: userId,
    };

    const token = this.jwtService.sign(payload, signOptions);
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;
    return {
      cookie,
      token,
    };
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
