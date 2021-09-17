import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

import { PrismaError } from '../../common/database/prismaErrorCodes.enum';

export class PrismaErrorException {
  private logger = new Logger(this.constructor.name);
  handleError(error: any) {
    switch (error.code) {
      case PrismaError.RequiredRelationViolation:
        throw new BadRequestException('Device already in use');

      case PrismaError.DependsOnOneOrMoreRecords:
        throw new NotFoundException('Record not found');

      case PrismaError.UniqueConstraintViolation:
        throw new BadRequestException(
          `${error.meta.target[0]} already in use for another vehicle`,
        );

      case PrismaError.RecordDoesNotExist:
        throw new NotFoundException(`Record not found`);

      default:
        this.logger.error('Prisma Error =>', error);
    }
  }
}
