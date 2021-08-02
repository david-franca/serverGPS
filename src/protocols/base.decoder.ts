import { AddressInfo, Socket } from 'net';
import { Device, PrismaClient } from '@prisma/client';

import { Protocol } from '../interfaces';
import { DeviceSession } from '../models';

const prisma = new PrismaClient();

export abstract class BaseProtocolDecoder {
  private static PROTOCOL_UNKNOWN = 'unknown';
  private protocol: Protocol;
  private channelDeviceSession: DeviceSession; // connection-based protocols
  private addressDeviceSessions: Map<AddressInfo, DeviceSession>; // connection less protocols

  /**
   * getProtocolName
   */
  public getProtocolName() {
    return this.protocol
      ? this.protocol.getName()
      : BaseProtocolDecoder.PROTOCOL_UNKNOWN;
  }

  /**
   * getDeviceSession
   */
  public async getDeviceSession(chanel: Socket, ...uniqueIds: string[]) {
    if (chanel) {
      const device = await this.findDevice(...uniqueIds);
      console.log('Device =>', device);
      if (device) {
        return {
          deviceSession: new DeviceSession(device.equipmentNumber),
          device,
        };
      } else {
        return null;
      }
    }
  }

  /**
   * findDeviceId
   */
  public async findDevice(...uniqueIds: string[]) {
    if (uniqueIds.length > 0) {
      let device: Device = null;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const uniqueId of uniqueIds) {
          if (uniqueId) {
            device = await prisma.device.findFirst({
              where: {
                equipmentNumber: uniqueId,
              },
            });
            return device;
          }
        }
      } catch (e) {
        return null;
      }
    }
  }
}
