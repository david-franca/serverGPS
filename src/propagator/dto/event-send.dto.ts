import { EventEmitDTO } from './event-emit.dto';

export class EventSendDTO extends EventEmitDTO {
  public readonly username: string;
  public readonly socketId: string;
}
