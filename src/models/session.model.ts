export class DeviceSession {
  private deviceId: string;
  private timeZone: string;
  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }

  public getDeviceId(): string {
    return this.deviceId;
  }

  public setTimeZone(timeZone: string): void {
    this.timeZone = timeZone;
  }

  public getTimeZone(): string {
    return this.timeZone;
  }
}
