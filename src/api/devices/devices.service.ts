import { Cache } from 'cache-manager';

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Device, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '../exception/NotFound.exception';

@Injectable()
export class DevicesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: Prisma.DeviceCreateInput): Promise<Device> {
    await this.clearCache();
    console.log(data);
    return await this.prisma.device.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeviceWhereUniqueInput;
    where?: Prisma.DeviceWhereInput;
    orderBy?: Prisma.DeviceOrderByInput;
  }): Promise<Device[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const devices = await this.prisma.device.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy ?? {
        createAt: 'asc',
      },
      include: {
        alert: true,
        location: true,
        status: {
          include: {
            info: true,
          },
        },
      },
    });

    devices.forEach((device) => {
      device.location.sort((a, b) => {
        return b.fixTime.getTime() - a.fixTime.getTime();
      });

      device.status.sort((a, b) => {
        return b.updateAt.getTime() - a.updateAt.getTime();
      });
      device.location.length = 1;
      device.status.length = 1;
    });
    return devices;
  }

  async searchAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeviceWhereUniqueInput;
    where?: Prisma.DeviceWhereInput;
    orderBy?: Prisma.DeviceOrderByInput;
  }): Promise<Device[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const devices = await this.prisma.device.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        location: true,
        alert: true,
        status: {
          include: {
            info: true,
          },
        },
      },
    });

    devices.forEach((device) => {
      device.location.sort((a, b) => {
        return b.fixTime.getTime() - a.fixTime.getTime();
      });

      device.status.sort((a, b) => {
        return b.updateAt.getTime() - a.updateAt.getTime();
      });
      device.location.length = 1;
      device.status.length = 1;
    });
    return devices;
  }

  async findOne(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    const device = await this.prisma.device.findUnique({ where });
    if (device) {
      return device;
    }
    throw new NotFoundException(where.id, 'Device');
  }

  async update(params: {
    where: Prisma.DeviceWhereUniqueInput;
    data: Prisma.DeviceUpdateInput;
  }): Promise<Device> {
    const { data, where } = params;
    try {
      await this.clearCache();
      return await this.prisma.device.update({
        data,
        where,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(where.id, 'Device');
      }
      throw error;
    }
  }

  async remove(where: Prisma.DeviceWhereUniqueInput): Promise<void> {
    try {
      await this.prisma.device.update({
        where,
        data: {
          deleted: true,
        },
      });
      await this.clearCache();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(where.id, 'Device');
      }
      throw error;
    }
  }

  async clearCache() {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach((key) => {
      if (key.startsWith('GET_DEVICES_CACHE')) {
        this.cacheManager.del(key);
      }
    });
  }
}
