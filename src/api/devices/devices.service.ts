import { Injectable } from '@nestjs/common';
import { Device, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { DeviceNotFoundException } from './exception/devicesNotFound.exception';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.DeviceCreateInput): Promise<Device> {
    return this.prisma.device.create({ data });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeviceWhereUniqueInput;
    where?: Prisma.DeviceWhereInput;
    orderBy?: Prisma.DeviceOrderByInput;
  }): Promise<Device[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.device.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy: orderBy ?? {
        createAt: 'asc',
      },
    });
  }

  async searchAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.DeviceWhereUniqueInput;
    where?: Prisma.DeviceWhereInput;
    orderBy?: Prisma.DeviceOrderByInput;
  }): Promise<Device[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.device.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    const device = await this.prisma.device.findUnique({ where });
    if (device) {
      return device;
    }
    throw new DeviceNotFoundException(where.id);
  }

  async update(params: {
    where: Prisma.DeviceWhereUniqueInput;
    data: Prisma.DeviceUpdateInput;
  }): Promise<Device> {
    const { data, where } = params;
    try {
      return await this.prisma.device.update({
        data,
        where,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        PrismaError.RecordDoesNotExist
      ) {
        throw new DeviceNotFoundException(where.id);
      }
      throw error;
    }
  }

  async remove(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    try {
      return this.prisma.device.delete({
        where,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new DeviceNotFoundException(where.id);
      }
      throw error;
    }
  }
}
