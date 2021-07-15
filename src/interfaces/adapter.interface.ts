import Position from '../models/position.model';

export interface AdapterInterface {
  decode(msg: Buffer): Promise<Position>;
}
