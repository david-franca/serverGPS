import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import {
  Alert,
  Branch,
  Customer,
  Device,
  Info,
  Location,
  Status,
  User,
  Vehicle,
} from '@prisma/client';

import { Action } from '../common/interfaces';

export type AppAbility = PrismaAbility<
  [
    string,
    (
      | Subjects<{
          Vehicle: Vehicle;
          Alert: Alert;
          Branch: Branch;
          Customer: Customer;
          Device: Device;
          Info: Info;
          Location: Location;
          Status: Status;
          User: User;
        }>
      | 'all'
    ),
  ]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
    const { can, cannot, build } = new AbilityBuilder(AppAbility);
    if (user.role === 'ADMIN') {
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    cannot(Action.Delete, 'User', { id: user.id });

    return build();
  }
}
