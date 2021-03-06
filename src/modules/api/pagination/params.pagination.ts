import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { Prisma } from '@prisma/client';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  take?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  order?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  sort?: Prisma.SortOrder;
}
