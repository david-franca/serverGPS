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

import { ApiProperty } from '@nestjs/swagger';
import { VehiclesType } from '@prisma/client';
import { IsChassi, IsLicensePlate, IsRenavam } from '@validators';

export class CreateVehicleDto {
  @IsLicensePlate()
  @Length(8)
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsEnum(VehiclesType)
  @IsNotEmpty()
  type: VehiclesType;

  @ApiProperty({ nullable: true, required: false })
  @IsUUID()
  @IsOptional()
  deviceId: string;

  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @ApiProperty({ nullable: true, required: false })
  @MaxLength(30)
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({ nullable: true, required: false })
  @MaxLength(30)
  @IsString()
  @IsOptional()
  model: string;

  @ApiProperty({ nullable: true, required: false })
  @MaxLength(30)
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ nullable: true, required: false })
  @IsNumber({ maxDecimalPlaces: 4 })
  @IsOptional()
  year: number;

  @ApiProperty({ nullable: true, required: false })
  @IsChassi()
  @IsString()
  @IsOptional()
  chassi: string;

  @ApiProperty({ nullable: true, required: false })
  @IsRenavam()
  @MaxLength(17)
  @IsString()
  @IsOptional()
  renavam: string;

  @ApiProperty({ nullable: true, required: false })
  @MaxLength(150)
  @IsString()
  @IsOptional()
  observation: string;
}
