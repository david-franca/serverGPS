import { AddressInfo, Socket } from 'net';

import { Protocol } from '../interfaces/protocol.interface';
import DeviceSession from '../models/session.model';

export default abstract class BaseProtocolDecoder {
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
  public async getDeviceSession(chanel: Socket, ...uniqueIds: number[]) {
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
  public async findDevice(...uniqueIds: number[]) {
    if (uniqueIds.length > 0) {
      // let device = null;

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const uniqueId of uniqueIds) {
          // if (uniqueId) {
          //   device = await getRepository(Adapter).findOne({
          //     where: { equipmentNumber: uniqueId },
          //   });
          //   return device;
          // }
        }
      } catch (e) {
        return null;
      }
    }
  }
}
