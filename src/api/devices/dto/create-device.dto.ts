import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { MobileOperator, Model, Timezone } from '@prisma/client';

export class CreateDeviceDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: Model })
  @IsEnum(Model)
  @IsNotEmpty()
  model: Model;

  @MaxLength(15)
  @IsString()
  @IsNotEmpty()
  equipmentNumber: string;

  @MaxLength(25)
  @IsMobilePhone('pt-BR')
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: MobileOperator })
  @IsEnum(MobileOperator)
  @IsNotEmpty()
  mobileOperator: MobileOperator;

  @MaxLength(25)
  @IsMobilePhone('pt-BR')
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  chipNumber: string;

  @ApiProperty({ enum: Timezone })
  @IsEnum(Timezone)
  @IsNotEmpty()
  timezone: Timezone;
}
