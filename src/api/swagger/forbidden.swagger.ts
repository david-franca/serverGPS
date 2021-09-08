import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

class ForbiddenSwagger {
  @ApiProperty({ default: HttpStatus.FORBIDDEN })
  statusCode: number;

  @ApiProperty({ default: 'Forbidden resource' })
  message: string;

  @ApiProperty({ default: 'Forbidden' })
  error: string;
}

export const forbiddenOptions: ApiResponseOptions = {
  type: ForbiddenSwagger,
  description: 'Authentication is necessary.',
};
