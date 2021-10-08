import { NotFoundException } from '@common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}
  async create(createVehicleDto: CreateVehicleDto) {
    let device: Prisma.DeviceCreateNestedOneWithoutVehicleInput;
    const vehicleCheck = await this.prisma.vehicle.findFirst({
      where: { deviceId: createVehicleDto.deviceId },
    });

    if (vehicleCheck) {
      throw new BadRequestException('Device just attached to another vehicle');
    }

    if (createVehicleDto.deviceId) {
      device = {
        connect: { id: createVehicleDto.deviceId },
      };
    }

    const vehicle = await this.prisma.vehicle.create({
      data: {
        licensePlate: createVehicleDto.licensePlate,
        type: createVehicleDto.type,
        chassi: createVehicleDto.chassi,
        brand: createVehicleDto.brand,
        color: createVehicleDto.color,
        model: createVehicleDto.model,
        observation: createVehicleDto.observation,
        renavam: createVehicleDto.renavam,
        year: createVehicleDto.year,
        customer: { connect: { id: createVehicleDto.customerId } },
        branch: {
          connect: { id: createVehicleDto.branchId },
        },
        device,
      },
    });
    return vehicle;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.VehicleWhereUniqueInput;
    where?: Prisma.VehicleWhereInput;
    orderBy?: Prisma.VehicleOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.vehicle.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        branch: true,
        device: {
          include: {
            location: { orderBy: { fixTime: 'desc' }, take: 10 },
            alert: true,
            status: true,
          },
        },
      },
    });
  }

  async findOne(where: Prisma.VehicleWhereUniqueInput) {
    const vehicle = await this.prisma.vehicle.findUnique({ where });

    if (vehicle) {
      return vehicle;
    }
    return new NotFoundException(where.id, 'Vehicle');
  }

  async update(params: {
    where: Prisma.VehicleWhereUniqueInput;
    data: Prisma.VehicleUpdateInput;
  }) {
    const { data, where } = params;
    return await this.prisma.vehicle.update({ data, where });
  }
}
