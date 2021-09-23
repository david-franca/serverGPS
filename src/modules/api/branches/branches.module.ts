import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';

@Module({
  controllers: [BranchesController],
  providers: [BranchesService],
  imports: [PrismaModule],
})
export class BranchesModule {}
