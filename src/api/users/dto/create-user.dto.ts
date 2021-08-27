import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { Prisma } from '@prisma/client';

export class CreateUserDto implements Prisma.UserCreateInput {
  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  username: string;

  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  role: string;
}
