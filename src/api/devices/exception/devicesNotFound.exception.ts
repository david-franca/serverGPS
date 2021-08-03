import { NotFoundException } from '@nestjs/common';

export class DeviceNotFoundException extends NotFoundException {
  constructor(deviceId: string) {
    super(`Device with id ${deviceId} not found`);
  }
}
