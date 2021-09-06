import { ApiProperty } from '@nestjs/swagger';
import { Device, MobileOperator, Model, Timezone } from '@prisma/client';

import { BaseSwagger } from './base.swagger';

export class DeviceSwagger extends BaseSwagger implements Device {
  @ApiProperty()
  code: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  model: Model;

  @ApiProperty()
  equipmentNumber: string;

  @ApiProperty()
  phone: string;

  @ApiProperty({ enum: MobileOperator })
  mobileOperator: MobileOperator;

  @ApiProperty()
  chipNumber: string;

  @ApiProperty({ enum: Timezone })
  timezone: Timezone;
}
