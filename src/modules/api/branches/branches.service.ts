import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { NotFoundException } from '../../../common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateBranchDto) {
    return await this.prisma.branch.create({
      data: {
        name: data.name,
        customer: { connect: { id: data.customerId } },
      },
    });
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
    return await this.prisma.branch.update({ data, where });
  }
}
