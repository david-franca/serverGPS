import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './vehicles.service';

@Module({
  controllers: [VehiclesController],
  providers: [VehiclesService],
  imports: [PrismaModule],
})
export class VehiclesModule {}
