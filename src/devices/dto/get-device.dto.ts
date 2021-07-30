import { MobileOperator, Model, Timezone } from '@prisma/client';

export class GetDeviceDto {
  id: string;
  active: boolean;
  deleted: boolean;
  createAt: Date;
  updateAt: Date;
  code: number;
  description: string;
  model: Model;
  equipmentNumber: number;
  phone: string;
  mobileOperator: MobileOperator;
  chipNumber: string;
  timezone: Timezone;
}
