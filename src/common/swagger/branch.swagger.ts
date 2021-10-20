import { ApiProperty } from '@nestjs/swagger';
import { Branch } from '@prisma/client';
import { randomUUID } from 'crypto';
import { fakerBr } from 'js-brasil';

import { BaseSwagger } from './base.swagger';

export class BranchSwagger extends BaseSwagger implements Branch {
  @ApiProperty({ default: randomUUID() })
  customerId: string;

  @ApiProperty({ default: fakerBr.empresa().nome })
  name: string;

  @ApiProperty({ default: 'Observações', required: false })
  note: string;
}
