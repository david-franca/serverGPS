import { Position } from '../models';

export interface AdapterInterface {
  decode(msg: Buffer): Promise<Position>;
  getPrefix(): string;
}
