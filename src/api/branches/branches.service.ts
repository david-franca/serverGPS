import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaError } from '../../database/prismaErrorCodes.enum';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '../exception/NotFound.exception';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateBranchDto) {
    try {
      return await this.prisma.branch.create({
        data: {
          name: data.name,
          customer: { connect: { id: data.customerId } },
        },
      });
    } catch (error) {
      if (error.code === PrismaError.DependsOnOneOrMoreRecords) {
        throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);
      }
      console.log(error);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BranchWhereUniqueInput;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.branch.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.BranchWhereUniqueInput) {
    const branch = await this.prisma.branch.findUnique({ where });
    if (branch) {
      return branch;
    }
    return new NotFoundException(where.id, 'Branch');
  }

  async update(params: {
    where: Prisma.BranchWhereUniqueInput;
    data: Prisma.BranchUpdateInput;
  }) {
    const { data, where } = params;
    try {
      return await this.prisma.branch.update({ data, where });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException(where.id, 'Device');
      }
      throw error;
    }
  }
}
