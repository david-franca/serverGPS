import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '../exception/NotFound.exception';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CustomerCreateInput) {
    try {
      return await this.prisma.customer.create({
        data,
      });
    } catch (error) {
      if (error.code === PrismaError.UniqueConstraintViolation) {
        throw new HttpException(
          'Customer with that CPF/CNPJ already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CustomerWhereUniqueInput;
    where?: Prisma.CustomerWhereInput;
    orderBy?: Prisma.CustomerOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.CustomerWhereUniqueInput) {
    const customer = await this.prisma.customer.findUnique({ where });
    if (customer) {
      return customer;
    }
    return new NotFoundException(where.id, 'Customer');
  }

  async update(params: {
    where: Prisma.CustomerWhereUniqueInput;
    data: Prisma.CustomerUpdateInput;
  }) {
    const { data, where } = params;
    try {
      return await this.prisma.customer.update({ data, where });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(where.id, 'Customer');
      }
      throw error;
    }
  }
}
