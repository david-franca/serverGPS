import { MobileOperator, Model, Timezone } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  IsEnum,
  IsNumberString,
  IsMobilePhone,
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

  @MaxLength(15)
  @IsString()
  @IsNotEmpty()
  equipmentNumber: string;

  @MaxLength(25)
  @IsMobilePhone('pt-BR')
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  phone: string;

  @IsEnum(MobileOperator)
  mobileOperator: MobileOperator;

  @MaxLength(25)
  @IsMobilePhone('pt-BR')
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  chipNumber: string;

  @IsEnum(Timezone)
  @IsNotEmpty()
  timezone: Timezone;
}
