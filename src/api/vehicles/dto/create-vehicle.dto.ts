import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
} from 'class-validator';

import { VehiclesType } from '@prisma/client';

import { IsChassi, IsLicensePlate, IsRenavam } from '../../../validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @IsLicensePlate()
  @Length(8)
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty({ enum: VehiclesType })
  @IsEnum(VehiclesType)
  @IsNotEmpty()
  type: VehiclesType;

  @IsUUID()
  @IsOptional()
  deviceId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @MaxLength(30)
  @IsString()
  @IsOptional()
  brand: string;

  @MaxLength(30)
  @IsString()
  @IsOptional()
  model: string;

  @MaxLength(30)
  @IsString()
  @IsOptional()
  color: string;

  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  year: number;

  @IsChassi()
  @IsString()
  @IsOptional()
  chassi: string;

  @IsRenavam()
  @MaxLength(17)
  @IsString()
  @IsOptional()
  renavam: string;

  @MaxLength(150)
  @IsString()
  @IsOptional()
  observation: string;
}
