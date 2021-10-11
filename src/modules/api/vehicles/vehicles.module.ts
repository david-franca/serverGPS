import { Module } from '@nestjs/common';

import { PrismaModule } from '../../prisma/prisma.module';
// import { VehiclesController } from './vehicles.controller';
import { VehiclesResolver } from './vehicles.resolver';
import { VehiclesService } from './vehicles.service';

@Module({
  // controllers: [VehiclesController],
  providers: [VehiclesService, VehiclesResolver],
  imports: [PrismaModule],
})
export class VehiclesModule {}
