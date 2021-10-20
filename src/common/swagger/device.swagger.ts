import { utilsBr } from 'js-brasil';

import { ApiProperty } from '@nestjs/swagger';
import { Device, MobileOperator, Model, Timezone } from '@prisma/client';

import { BaseSwagger } from './base.swagger';

export class DeviceSwagger extends BaseSwagger implements Device {
  @ApiProperty({ example: 1 })
  code: number;

  @ApiProperty({ nullable: true, required: false })
  description: string;

  @ApiProperty({ example: 'SUNTECH' })
  model: Model;

  @ApiProperty({ example: utilsBr.randomNumber(10000000, 99999999) })
  equipmentNumber: string;

  @ApiProperty({ example: '85986544589' })
  phone: string;

  @ApiProperty({
    enum: MobileOperator,
    enumName: 'MobileOperator',
  })
  mobileOperator: MobileOperator;

  @ApiProperty({ example: '16956654231' })
  chipNumber: string;

  @ApiProperty({ enum: Timezone })
  timezone: Timezone;

  @ApiProperty({ default: 'Observações', required: false })
  note: string;
}
