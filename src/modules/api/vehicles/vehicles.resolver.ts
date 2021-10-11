import { Query, Resolver } from '@nestjs/graphql';

import { Vehicle } from './entity/vehicles.entity';
import { VehiclesService } from './vehicles.service';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private vehiclesService: VehiclesService) {}

  @Query(() => [Vehicle])
  async getAll() {
    const vehicles = await this.vehiclesService.findAll({});
    return vehicles;
  }
}
