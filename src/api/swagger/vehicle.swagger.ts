import { randomUUID } from 'crypto';
import { fakerBr } from 'js-brasil';

import { ApiProperty } from '@nestjs/swagger';
import { Vehicle, VehiclesType } from '@prisma/client';

import { BaseSwagger } from './base.swagger';

const vehicle = fakerBr.veiculo();

export class VehicleSwagger extends BaseSwagger implements Vehicle {
  @ApiProperty({ default: vehicle.placa })
  licensePlate: string;

  @ApiProperty({ enum: VehiclesType })
  type: VehiclesType;

  @ApiProperty({ default: randomUUID() })
  deviceId: string;

  @ApiProperty({ default: randomUUID() })
  customerId: string;

  @ApiProperty({ default: randomUUID() })
  branchId: string;

  @ApiProperty({ default: vehicle.marca })
  brand: string;

  @ApiProperty({ default: vehicle.modelo })
  model: string;

  @ApiProperty({ default: vehicle.cor })
  color: string;

  @ApiProperty()
  year: number;

  @ApiProperty({ default: vehicle.chassi })
  chassi: string;

  @ApiProperty({ default: fakerBr.renavam() })
  renavam: string;

  @ApiProperty()
  observation: string;
}
