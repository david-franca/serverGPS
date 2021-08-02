import { ExtendedModel } from './extended.model';

export default class Message extends ExtendedModel {
  private deviceId: string;
  private type: string;

  public getDeviceId(): string {
    return this.deviceId;
  }

  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public getType(): string {
    return this.type;
  }

  public setType(type: string): void {
    this.type = type;
  }
}
