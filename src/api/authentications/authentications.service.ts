import { compare, hash } from 'bcrypt';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { Environments } from '../../interfaces';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersService: UsersService,
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
}
