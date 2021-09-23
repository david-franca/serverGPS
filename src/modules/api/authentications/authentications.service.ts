import { compare, hash } from 'bcrypt';

import { PrismaError } from '@common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environments } from '@types';

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

      user.password = undefined;
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
}
