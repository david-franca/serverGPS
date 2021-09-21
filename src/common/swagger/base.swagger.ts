import { randomUUID } from 'crypto';

import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseSwagger {
  @ApiProperty({ default: randomUUID() })
  id: string;

  @ApiProperty({ default: true })
  active: boolean;

  @ApiProperty({ default: false })
  deleted: boolean;

  @ApiProperty()
  createAt: Date;

  @ApiProperty()
  updateAt: Date;
}
