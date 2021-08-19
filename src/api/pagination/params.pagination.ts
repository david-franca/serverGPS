import { IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
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
