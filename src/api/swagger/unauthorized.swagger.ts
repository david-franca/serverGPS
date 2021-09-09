import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

class UnauthorizedSwagger {
  @ApiProperty({ default: HttpStatus.UNAUTHORIZED })
  statusCode: number;

  @ApiProperty({ default: 'Unauthorized' })
  message: string;
}

export const unauthorizedOptions: ApiResponseOptions = {
  type: UnauthorizedSwagger,
  description: 'Authentication is necessary.',
};
