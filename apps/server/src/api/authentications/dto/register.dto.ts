import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { Role } from '@prisma/client';

export class RegisterDto {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(100)
  @MinLength(7)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(50)
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
