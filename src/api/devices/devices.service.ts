import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Device, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
      orderBy,
    });
  }

  async findOne(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    const device = await this.prisma.device.findUnique({ where });
    if (device) {
      return device;
    }
    throw new HttpException('Device not found', HttpStatus.NOT_FOUND);
  }

  async update(params: {
    where: Prisma.DeviceWhereUniqueInput;
    data: Prisma.DeviceUpdateInput;
  }): Promise<Device> {
    const { data, where } = params;
    return this.prisma.device.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.DeviceWhereUniqueInput): Promise<Device> {
    return this.prisma.device.delete({
      where,
    });
  }
}
