import { NotFoundException as NotFound } from '@nestjs/common';

export class NotFoundException extends NotFound {
  constructor(deviceId: string, className: string) {
    super(`${className} with id ${deviceId} not found`);
  }
}
