import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaError } from '../../database/prismaErrorCodes.enum';

export class PrismaErrorException {
  private logger = new Logger(this.constructor.name);
  handleError(error: any) {
    switch (error.code) {
      case PrismaError.RequiredRelationViolation:
        throw new HttpException(
          'Device already in use',
          HttpStatus.BAD_REQUEST,
        );

      case PrismaError.DependsOnOneOrMoreRecords:
        throw new HttpException(
          'An operation failed because it depends on one or more records that were required but not found.',
          HttpStatus.BAD_REQUEST,
        );

      case PrismaError.UniqueConstraintViolation:
        throw new HttpException(
          `${error.meta.target[0]} already in use for another vehicle`,
          HttpStatus.BAD_REQUEST,
        );

      case PrismaError.RecordDoesNotExist:
        throw new HttpException(`Record not found`, HttpStatus.BAD_REQUEST);

      default:
        this.logger.error('Prisma Error =>', error);
    }
  }
}
