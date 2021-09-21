import { Injectable } from '@nestjs/common';
import { Device, Location, Prisma, Status } from '@prisma/client';

import { PrismaService } from '../modules';
import { Position } from '../modules/tcp/models';

@Injectable()
export class PositionService {
  private prisma: PrismaService = new PrismaService();

  async location(
    adapterWhereUniqueInput: Prisma.LocationWhereUniqueInput,
  ): Promise<Location> {
    return this.prisma.location.findUnique({
      where: adapterWhereUniqueInput,
    });
  }

  async locations(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.LocationWhereUniqueInput;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByInput;
  }): Promise<Location[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.location.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createLocation(position: Position): Promise<Location> {
    return this.prisma.location.create({
      data: {
        cellId:
          position.getInteger('cellId').toString() ??
          position.getNetwork().getCellTowers()[0].getCellId().toString(),
        course: position.getCourse().toString(),
        fixTime: position.getFixTime(),
        latitude: position.getLatitude(),
        longitude: position.getLongitude(),
        speed: position.getSpeed(),
        satellite: position.getInteger('sat'),
        serverTime: position.getServerTime(),
        device: {
          connect: {
            id: position.getAny<Device>('device').id,
          },
        },
      },
    });
  }

  async createStatus(position: Position): Promise<Status> {
    return this.prisma.status.create({
      data: {
        blocked: false,
        valid: position.getValid(),
        charge: true,
        ignition: position.getBoolean('ignition'),
        battery: position.getInteger('batteryLevel'),
        rssi: position.getInteger('rssi'),
        device: {
          connect: {
            id: position.getAny<Device>('device').id,
          },
        },
        info: {
          create: {
            odometer: position.getAttributes().get('odometer'),
            power: position.getAttributes().get('power'),
            serial: position.getAttributes().get('index'),
            mode: position.getAttributes().get('status'),
            io: position.getString('io'),
            hourMeter: position.getAttributes().get('hours'),
            archive: position.getAttributes().get('archive'),
          },
        },
      },
    });
  }
}
