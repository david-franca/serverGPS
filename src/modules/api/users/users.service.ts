import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { Environments } from '@types';
import { compare, hash } from 'bcrypt';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService<Record<Environments, string>>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data,
    });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with this username does not exist');
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User with this id does not exist');
    }
    return user;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.findOne(userId);

    const isRefreshTokenMatching = await compare(
      refreshToken,
      user.refreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async setCurrentRefreshToken(refreshToken: string, id: string) {
    const currentHashedRefreshToken = await hash(
      refreshToken,
      this.configService.get('SALT_NUMBER'),
    );
    await this.prisma.user.update({
      data: {
        refreshToken: currentHashedRefreshToken,
      },
      where: { id },
    });
  }

  async removeRefreshToken(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken: null },
    });
  }
}
