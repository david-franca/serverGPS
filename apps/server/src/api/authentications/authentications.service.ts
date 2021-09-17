import { compare, hash } from 'bcrypt';

import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Environments } from '@types';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { PrismaError } from '../../common/database/prismaErrorCodes.enum';

@Injectable()
export class AuthenticationsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService<Record<Environments, any>>,
    private mailerService: MailerService,
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

  private async confirmEmail() {
    // TODO
  }
}
