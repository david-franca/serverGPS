import { MobileOperator, Model, Timezone } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsEnum,
  IsNumberString,
} from 'class-validator';

export class CreateDeviceDto {
  @IsNumber()
  @IsNotEmpty()
  code: number;

  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Model)
  @IsNotEmpty()
  model: Model;

  @IsNumber()
  @IsNotEmpty()
  equipmentNumber: bigint;

  @MaxLength(25)
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  phone: string;

  @IsEnum(MobileOperator)
  mobileOperator: MobileOperator;

  @MaxLength(25)
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  chipNumber: string;

  @IsEnum(Timezone)
  @IsNotEmpty()
  timezone: Timezone;
}

/**
 *   code            Int            @db.Integer
  description     String         @db.VarChar(200)
  model           Model
  equipmentNumber BigInt         @db.BigInt
  phone           String         @db.VarChar(25)
  mobileOperator  MobileOperator
  chipNumber      String         @db.VarChar(25)
  timezone        Timezone
 */
