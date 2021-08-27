import { Socket } from 'socket.io';

import { TokenPayload } from '../api/authentications/interface/tokenPayload.interface';

export interface AuthenticatedSocket extends Socket {
  auth: TokenPayload;
}
