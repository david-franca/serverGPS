import { PrismaError } from '@common';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export class PrismaErrorException {
  private logger = new Logger(this.constructor.name);
  handleError(error: any) {
    switch (error.code) {
      case PrismaError.RequiredRelationViolation:
        throw new BadRequestException('Device already in use.');

      case PrismaError.DependsOnOneOrMoreRecords:
        throw new NotFoundException(
          `No ${error.meta.cause.split("'")[1]} record was found.`,
        );

      case PrismaError.UniqueConstraintViolation:
        throw new BadRequestException(
          `${error.meta.target[0]} already in use for another record.`,
        );

      case PrismaError.RecordDoesNotExist:
        throw new NotFoundException(`Record not found.`);

      case PrismaError.ValueTooLongForColumnType:
        throw new BadRequestException('Value too long.');

      default:
        throw new InternalServerErrorException(error);
    }
  }
}
