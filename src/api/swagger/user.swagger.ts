import { ApiProperty } from '@nestjs/swagger';
import { fakerBr } from 'js-brasil';

import { BaseSwagger } from './base.swagger';

const pessoa = fakerBr.pessoa();

export class UserSwagger extends BaseSwagger {
  @ApiProperty({ default: pessoa.nome })
  name: string;

  @ApiProperty({ default: pessoa.usuario })
  username: string;

  @ApiProperty()
  role: string;
}
