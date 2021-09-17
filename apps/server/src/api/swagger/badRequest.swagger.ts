import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponseOptions } from '@nestjs/swagger';

class BadRequestSwagger {
  @ApiProperty({ default: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ default: 'Error' })
  message: string;
}

export const badRequestOptions: ApiResponseOptions = {
  type: BadRequestSwagger,
  description: 'Bad Request.',
};
