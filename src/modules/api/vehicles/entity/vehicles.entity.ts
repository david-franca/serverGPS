import { Field, ObjectType } from '@nestjs/graphql';
import { Vehicle as V, VehiclesType } from '@prisma/client';

import { BaseEntity } from '../../entities/base.entity';

@ObjectType()
export class Vehicle extends BaseEntity implements V {
  @Field()
  licensePlate: string;

  @Field()
  type: VehiclesType;

  @Field({ nullable: true })
  deviceId: string | null;

  @Field()
  customerId: string;

  @Field()
  branchId: string;

  @Field({ nullable: true })
  brand: string | null;

  @Field({ nullable: true })
  model: string;

  @Field({ nullable: true })
  color: string | null;

  @Field({ nullable: true })
  year: number | null;

  @Field({ nullable: true })
  chassi: string | null;

  @Field({ nullable: true })
  renavam: string | null;

  @Field({ nullable: true })
  observation: string | null;
}
