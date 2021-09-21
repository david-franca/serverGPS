import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsPostalCode,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { States, TypeAddress } from '@prisma/client';
import { IsCPFOrCNPJ } from '@validators';

export class CreateCustomerDto {
  @MaxLength(50)
  @MinLength(5)
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @MaxLength(14)
  @MinLength(11)
  @IsCPFOrCNPJ()
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  cpfOrCnpj: string;

  @IsMobilePhone('pt-BR')
  @Length(11)
  @IsNumberString({ no_symbols: true })
  @IsNotEmpty()
  cellPhone: string;

  @ApiProperty({ nullable: true, required: false })
  @Length(10)
  @IsNumberString({ no_symbols: true })
  @IsOptional()
  landline: string;

  @IsEnum(TypeAddress)
  @IsNotEmpty()
  typeOfAddress: TypeAddress;

  @Length(9)
  @IsPostalCode('BR')
  @IsNotEmpty()
  cep: string;

  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  street: string;

  @MaxLength(6)
  @IsString()
  @IsNotEmpty()
  number: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ nullable: true, required: false })
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  @IsOptional()
  complement: string;

  @IsEnum(States)
  @IsNotEmpty()
  state: States;

  @MinLength(3)
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  city: string;
}
