import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

class UnprocessableEntitySwagger {
  @ApiProperty({ default: HttpStatus.UNPROCESSABLE_ENTITY })
  statusCode: number;

  @ApiProperty({
    isArray: true,
    example: [
      'Field1 must be a number',
      'Field2 must be a string',
      'Field3 must be a uuid',
    ],
  })
  message: string[];

  @ApiProperty({ default: 'Unprocessable Entity' })
  error: string;
}

export const unprocessableOptions: ApiResponseOptions = {
  type: UnprocessableEntitySwagger,
  description: 'One or more fields need to be validated correctly',
};
