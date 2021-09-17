import { Device } from '@prisma/client';

export class Attributes {
  device: Device;
  type: string;
  location: boolean;
  statusInfo: boolean;
  versionFw: string;
  cellId: number;
  sat: number;
  odometer: number;
  power: number;
  io: string;
  ignition: boolean;
  in1: boolean;
  in2: boolean;
  in3: boolean;
  out1: boolean;
  out2: boolean;
  status: number;
  index: number;
  hours: number;
  batteryLevel: number;
  archive: boolean;
}

export class CreatePositionDto {
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  valid: boolean;
  latitude: number;
  longitude: number;
  speed: number;
  course: number;
  protocol: string;
  outdated: boolean;
  altitude: number;
  address: string;
  accuracy: number;
  network: any;
  attributes: Attributes;
}
