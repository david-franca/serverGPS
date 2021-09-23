import { AddressInfo, Socket as TCPSocket } from 'net';

import { Device } from '@prisma/client';
import { Protocol } from '@types';

import { DeviceSession } from './models';
import prisma from './prisma';

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
  public async getDeviceSession(chanel: TCPSocket, ...uniqueIds: string[]) {
    if (chanel) {
      const device = await this.findDevice(...uniqueIds);
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
