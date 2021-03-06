import { Socket } from 'net';

import { Device } from '@prisma/client';
import { AdapterInterface } from '@types';
import { BitUtil, DateFormat, UnitsConverter } from '@utils';

import { BaseProtocolDecoder } from '../';
import {
  CellTower,
  DeviceSession,
  Network,
  Position,
  TimeZone,
} from '../models';

const compatibleHardware = ['SUNTECH/supplier'];
const modelName = 'SUNTECH';
const protocol = 'SUNTECH';

class SuntechProtocolDecoder
  extends BaseProtocolDecoder
  implements AdapterInterface
{
  private prefix: string;
  private protocolType: number;
  private hbm: boolean;
  private includeAdc: boolean;
  private includeRpm: boolean;
  private includeTemp: boolean;

  private connection: Socket;
  private session: {
    deviceSession: DeviceSession;
    device: Device;
  };

  constructor(connection: Socket) {
    super();
    this.connection = connection;
    this.session = null;
  }

  public getPrefix(): string {
    return this.prefix;
  }

  private setProtocolType(protocolType: number): void {
    this.protocolType = protocolType;
  }

  private getProtocolType(deviceId: string): number {
    // TODO
    return Number(deviceId);
  }

  private setHbm(hbm: boolean): void {
    this.hbm = hbm;
  }

  public requestLogout() {
    console.log('logout');
  }

  private isHbm(type: string, length: number): boolean {
    if (['STT', 'UEX'].includes(type) && length > 18) return true;
    if (['EMG', 'EVT', 'ALT'].includes(type) && length > 17) {
      return true;
    } else return false;
  }

  private setIncludeAdc(includeAdc: boolean): void {
    this.includeAdc = includeAdc;
  }

  private isIncludeAdc(deviceId: string): boolean {
    deviceId ? this.setIncludeAdc(true) : this.setIncludeAdc(false);
    return this.includeAdc;
  }

  private setIncludeRpm(includeRpm: boolean): void {
    this.includeRpm = includeRpm;
  }

  private isIncludeRpm(deviceId: string): boolean {
    deviceId ? this.setIncludeRpm(true) : this.setIncludeRpm(false);
    return this.includeRpm;
  }

  private setIncludeTemp(includeTemp: boolean): void {
    this.includeTemp = includeTemp;
  }

  private isIncludeTemp(deviceId: string): boolean {
    deviceId ? this.setIncludeTemp(true) : this.setIncludeTemp(false);
    return this.includeTemp;
  }

  private decodeEmergency(value: number): string {
    switch (value) {
      case 1:
        return Position.ALARM_SOS;
      case 2:
        return Position.ALARM_PARKING;
      case 3:
        return Position.ALARM_POWER_CUT;
      case 5:
      case 6:
        return Position.ALARM_DOOR;
      case 7:
        return Position.ALARM_MOVEMENT;
      case 8:
        return Position.ALARM_SHOCK;
      default:
        return null;
    }
  }

  private static decodeAlert(value: number): string {
    switch (value) {
      case 1:
        return Position.ALARM_OVERSPEED;
      case 5:
        return Position.ALARM_GEOFENCE_EXIT;
      case 6:
        return Position.ALARM_GEOFENCE_ENTER;
      case 14:
        return Position.ALARM_LOW_BATTERY;
      case 15:
        return Position.ALARM_SHOCK;
      case 16:
        return Position.ALARM_ACCIDENT;
      case 40:
        return Position.ALARM_POWER_RESTORED;
      case 41:
        return Position.ALARM_POWER_CUT;
      case 46:
        return Position.ALARM_ACCELERATION;
      case 47:
        return Position.ALARM_BRAKING;
      case 50:
        return Position.ALARM_JAMMING;
      default:
        return null;
    }
  }

  private async decode9(values: string[], channel: Socket) {
    let index = 1;

    const type = values[index++];

    if (!['Location', 'Emergency', 'Alert'].includes(type)) {
      return null;
    }

    const id = values[index++];

    if (!this.session) {
      const session = await this.getDeviceSession(channel, id);

      if (!session) {
        return null;
      }
      this.session = session;
    }

    const position = new Position();
    position.setDeviceId(this.session.deviceSession.getDeviceId());
    position.set('device', this.session.device);

    if (['Emergency', 'Alert'].includes(type)) {
      position.set(Position.KEY_ALARM, Position.ALARM_GENERAL);
    }

    if (
      type !== 'Alert' ||
      this.getProtocolType(position.getDeviceId()) === 0
    ) {
      position.set(Position.KEY_VERSION_FW, values[index++]);
    }
    const dateFormat = new DateFormat();
    dateFormat.setTimeZone('GMT');

    position.setTime(dateFormat.parse(values[index++], values[index++]));
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3']),
    );

    if (this.getProtocolType(position.getDeviceId()) === 1) {
      index += 1; // cell
    }

    position.setLatitude(parseFloat(values[index++]));
    position.setLongitude(parseFloat(values[index++]));
    position.setSpeed(UnitsConverter.knotsFromKph(parseFloat(values[index++])));
    position.setCourse(parseFloat(values[index++]));

    position.setValid(values[index++] === '1');

    if (this.getProtocolType(position.getDeviceId()) === 1) {
      position.set(Position.KEY_ODOMETER, parseInt(values[index++]));
    }

    return position;
  }

  private async decode4(values: string[], channel: Socket) {
    let index = 0;

    const type = values[index++].substring(5);

    if (!['ALT', 'STT'].includes(type)) {
      return null;
    }

    const id = values[index++];

    if (!this.session) {
      const session = await this.getDeviceSession(channel, id);

      if (!session) {
        return null;
      }
      this.session = session;
    }

    const position = new Position();
    position.setDeviceId(this.session.deviceSession.getDeviceId());
    position.set('device', this.session.device);

    position.set(Position.KEY_TYPE, type);

    position.set(Position.KEY_VERSION_FW, values[index++]);
    index += 1; // model

    const network = new Network();

    for (let i = 0; i < 7; i++) {
      const cid = parseInt(values[index++]);
      const mcc = parseInt(values[index++]);
      const mnc = parseInt(values[index++]);
      let lac: number;
      let rssi: number;
      if (i === 0) {
        rssi = parseInt(values[index++]);
        lac = parseInt(values[index++]);
      } else {
        lac = parseInt(values[index++]);
        rssi = parseInt(values[index++]);
      }
      index += 1; // timing advance
      if (cid > 0) {
        network.addCellTower(CellTower.from(mcc, mnc, lac, cid, rssi));
      }
    }

    position.setNetwork(network);
    position.set(
      Position.KEY_BATTERY_LEVEL,
      UnitsConverter.percentage(4.2, parseFloat(values[index++])),
    );
    position.set(Position.KEY_ARCHIVE, values[index++] === '0' ? true : null);
    position.set(Position.KEY_INDEX, parseInt(values[index++]));
    position.set(Position.KEY_STATUS, parseInt(values[index++]));

    if (values[index].length === 3) {
      index += 1; // collaborative network
    }

    const dateFormat = new DateFormat();
    dateFormat.setTimeZone('GMT');
    position.setTime(dateFormat.parse(values[index++], values[index++]));
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3']),
    );

    position.setLatitude(parseFloat(values[index++]));
    position.setLongitude(parseFloat(values[index++]));
    position.setSpeed(UnitsConverter.knotsFromKph(parseFloat(values[index++])));
    position.setCourse(parseFloat(values[index++]));

    position.set(Position.KEY_SATELLITES, parseInt(values[index++]));

    position.setValid(values[index++] === '1');

    return position;
  }

  private async decode2356(
    protocol: string,
    values: string[],
    channel: Socket,
  ) {
    let index = 0;
    const type: string = values[index++].substring(5);

    if (!['STT', 'EMG', 'EVT', 'ALT', 'UEX'].includes(type)) {
      return null;
    }

    const id = values[index++];

    if (!this.session) {
      const session = await this.getDeviceSession(channel, id);

      if (!session) {
        return null;
      }
      this.session = session;
    }

    const position: Position = new Position();
    position.setDeviceId(this.session.deviceSession.getDeviceId());
    position.set('device', this.session.device);
    position.set(Position.KEY_TYPE, type);
    position.set('location', true);
    position.set('statusInfo', true);

    if (
      protocol.startsWith('ST3') ||
      protocol === 'ST500' ||
      protocol === 'ST600'
    ) {
      index += 1; // model
    }

    position.set(Position.KEY_VERSION_FW, values[index++]);

    const dateFormat = new DateFormat();
    dateFormat.setTimeZone('GMT');
    position.setTime(dateFormat.parse(values[index++], values[index++]));
    position.setFixTime(
      dateFormat.fixTime(position.getFixTime(), TimeZone['GMT-3']),
    );

    if (protocol !== 'ST500') {
      const cid: number = parseInt(values[index++]);
      if (protocol === 'ST600') {
        position.setNetwork(
          new Network(
            CellTower.from(
              parseInt(values[index++]),
              parseInt(values[index++]),
              parseInt(values[index++], 16),
              cid,
              parseInt(values[index++]),
            ),
          ),
        );
      }
      position.set('cellId', cid);
    }
    position.setLatitude(parseFloat(values[index++]));
    position.setLongitude(parseFloat(values[index++]));

    position.setSpeed(parseInt(values[index++]));
    position.setCourse(parseInt(values[index++]));

    position.set(Position.KEY_SATELLITES, parseInt(values[index++]));

    position.setValid(values[index++] === '1');

    position.set(Position.KEY_ODOMETER, parseInt(values[index++]));
    position.set(Position.KEY_POWER, parseFloat(values[index++]));
    const io: string = values[index++];
    position.set('io', io);

    if (io.length >= 6) {
      position.set(Position.KEY_IGNITION, io.charAt(0) === '1');
      position.set(Position.PREFIX_IN + 1, io.charAt(1) === '1');
      position.set(Position.PREFIX_IN + 2, io.charAt(2) === '1');
      position.set(Position.PREFIX_IN + 3, io.charAt(3) === '1');
      position.set(Position.PREFIX_OUT + 1, io.charAt(4) === '1');
      position.set(Position.PREFIX_OUT + 2, io.charAt(5) === '1');
    }

    switch (type) {
      case 'STT':
        position.set(Position.KEY_STATUS, parseInt(values[index++]));
        position.set(Position.KEY_INDEX, parseInt(values[index++]));
        break;
      case 'EMG':
        position.set(
          Position.KEY_ALARM,
          this.decodeEmergency(parseInt(values[index++])),
        );
        break;
      case 'EVT':
        position.set(Position.KEY_EVENT, parseInt(values[index++]));
        break;
      case 'ALT':
        position.set(
          Position.KEY_ALARM,
          SuntechProtocolDecoder.decodeAlert(parseInt(values[index++])),
        );
        break;
      case 'UEX':
        this.decodeUex(position, parseInt(values[index++]), values[index++]);
        index += 1;
        break;
      default:
        break;
    }

    if (this.isHbm(type, values.length)) {
      if (index < values.length) {
        position.set(
          Position.KEY_HOURS,
          UnitsConverter.msFromMinutes(parseInt(values[index++])),
        );
      }

      if (index < values.length) {
        position.set(
          Position.KEY_BATTERY_LEVEL,
          UnitsConverter.percentage(4.2, parseFloat(values[index++])),
        );
      }

      if (index < values.length && values[index++] === '0') {
        position.set(Position.KEY_ARCHIVE, true);
      }

      if (this.isIncludeAdc(position.getDeviceId())) {
        for (let i = 1; i <= 3; i++) {
          if (index < values.length && !values[index++]) {
            position.set(
              Position.PREFIX_ADC + i,
              parseFloat(values[index - 1]),
            );
          }
        }
      }

      if (this.isIncludeRpm(position.getDeviceId())) {
        const value = values[index++];
        if (value) {
          position.set(Position.KEY_RPM, parseInt(value));
        }
      }

      if (values.length - index >= 2) {
        const driverUniqueId: string = values[index++];
        if (values[index++] === '1' && !driverUniqueId) {
          position.set(Position.KEY_DRIVER_UNIQUE_ID, driverUniqueId);
        }
      }

      if (this.isIncludeTemp(position.getDeviceId())) {
        for (let i = 0; i <= 3; i++) {
          const temperature: string = values[index++];
          if (temperature) {
            const value: string = temperature.substring(
              temperature.indexOf(':') + 1,
            );
            if (!value) {
              position.set(Position.PREFIX_TEMP + i, parseFloat(value));
            }
          }
        }
      }
    }

    return position;
  }

  private async decodeUniversal(values: string[], channel: Socket) {
    let index = 0;

    const type = values[index++];

    if (!['STT', 'ALT'].includes(type)) {
      return null;
    }

    const id = values[index++];

    if (!this.session) {
      const session = await this.getDeviceSession(channel, id);

      if (!session) {
        return null;
      }
      this.session = session;
    }

    const position = new Position();
    position.setDeviceId(this.session.deviceSession.getDeviceId());
    position.set('device', this.session.device);
    position.set(Position.KEY_TYPE, type);

    const mask = parseInt(values[index++], 16);

    if (BitUtil.check(mask, 1)) {
      index += 1; // model
    }

    if (BitUtil.check(mask, 2)) {
      position.set(Position.KEY_VERSION_FW, values[index++]);
    }

    if (BitUtil.check(mask, 3) && values[index++] === '0') {
      position.set(Position.KEY_ARCHIVE, true);
    }

    if (BitUtil.check(mask, 4) && BitUtil.check(mask, 5)) {
      const dateFormat = new DateFormat();
      dateFormat.setTimeZone('UTC');
      position.setTime(dateFormat.parse(values[index++], values[index++]));
    }

    const cellTower = new CellTower();
    if (BitUtil.check(mask, 6)) {
      cellTower.setCellId(parseInt(values[index++], 16));
    }
    if (BitUtil.check(mask, 7)) {
      cellTower.setMobileCountryCode(parseInt(values[index++]));
    }
    if (BitUtil.check(mask, 8)) {
      cellTower.setMobileNetworkCode(parseInt(values[index++]));
    }
    if (BitUtil.check(mask, 9)) {
      cellTower.setLocationAreaCode(parseInt(values[index++], 16));
    }
    if (cellTower.getCellId() !== null) {
      position.setNetwork(new Network(cellTower));
    }

    if (BitUtil.check(mask, 10)) {
      position.set(Position.KEY_RSSI, parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 11)) {
      position.setLatitude(parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 12)) {
      position.setLongitude(parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 13)) {
      position.setSpeed(UnitsConverter.knotsFromKph(parseInt(values[index++])));
    }

    if (BitUtil.check(mask, 14)) {
      position.setCourse(parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 15)) {
      position.set(Position.KEY_SATELLITES, parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 16)) {
      position.setValid(values[index++] === '1');
    }

    if (BitUtil.check(mask, 17)) {
      position.set(Position.KEY_INPUT, parseInt(values[index++]));
    }

    if (BitUtil.check(mask, 18)) {
      position.set(Position.KEY_OUTPUT, parseInt(values[index++]));
    }

    if (type === 'ALT') {
      if (BitUtil.check(mask, 19)) {
        position.set('alertId', values[index++]);
      }
      if (BitUtil.check(mask, 20)) {
        position.set('alertModifier', values[index++]);
      }
      if (BitUtil.check(mask, 21)) {
        position.set('alertData', values[index++]);
      }
    } else {
      if (BitUtil.check(mask, 19)) {
        position.set('mode', parseInt(values[index++]));
      }
      if (BitUtil.check(mask, 20)) {
        position.set('reason', parseInt(values[index++]));
      }
      if (BitUtil.check(mask, 21)) {
        position.set(Position.KEY_INDEX, parseInt(values[index++]));
      }
    }

    if (BitUtil.check(mask, 22)) {
      index += 1; // reserved
    }

    if (BitUtil.check(mask, 23)) {
      const assignMask = parseInt(values[index++], 16);
      for (let i = 0; i <= 30; i++) {
        if (BitUtil.check(assignMask, i)) {
          position.set(Position.PREFIX_IO + (i + 1), values[index++]);
        }
      }
    }

    return position;
  }

  private decodeTravelerReport(values: string[]) {
    let index = 1;

    const position = new Position();
    position.setDeviceId(values[index++]);

    position.set(Position.KEY_DRIVER_UNIQUE_ID, values[values.length - 1]);

    return position;
  }

  private decodeUex(position: Position, value1: number, value2: string) {
    let remaining: number = value1;
    let totalFuel = 0;
    while (remaining > 0) {
      const attribute = value2;
      if (attribute.startsWith('CabAVL')) {
        const data: string[] = attribute.split(';');
        const fuel1: number = parseFloat(data[2]);
        if (fuel1 > 0) {
          totalFuel += fuel1;
          position.set('fuel1', fuel1);
        }
        const fuel2: number = parseFloat(data[3]);
        if (fuel2 > 0) {
          totalFuel += fuel2;
          position.set('fuel2', fuel2);
        }
      } else {
        const pair: string[] = attribute.split('=');
        if (pair.length >= 2) {
          let value: string = pair[1].trim();
          if (value.includes('.')) {
            value = value.substring(0, value.indexOf('.'));
          }
          let fuel: number;
          switch (pair[0].charAt(0)) {
            case 't':
              position.set(
                Position.PREFIX_TEMP + pair[0].charAt(2),
                parseInt(value, 16),
              );
              break;
            case 'N':
              fuel = parseInt(value, 16);
              totalFuel += fuel;
              position.set('fuel' + pair[0].charAt(2), fuel);
              break;
            case 'Q':
              position.set('drivingQuality', parseInt(value, 16));
              break;
            default:
              break;
          }
        }
      }
      remaining -= attribute.length + 1;
    }
    if (totalFuel > 0) {
      position.set(Position.KEY_FUEL_LEVEL, totalFuel);
    }
  }

  public async decode(data: Buffer) {
    const values: string[] = data.toString().split(';');

    this.prefix = values[0];

    if (this.prefix.length < 5) {
      return await this.decodeUniversal(values, this.connection);
    } else if (this.prefix.endsWith('HTE')) {
      return this.decodeTravelerReport(values);
    } else if (this.prefix.startsWith('ST9')) {
      return await this.decode9(values, this.connection);
    } else if (this.prefix.startsWith('ST4')) {
      return await this.decode4(values, this.connection);
    } else {
      return await this.decode2356(
        this.prefix.substring(0, 5),
        values,
        this.connection,
      );
    }
  }
}

export { protocol, modelName, compatibleHardware, SuntechProtocolDecoder };
