import { fakerBr } from 'js-brasil';

import { ApiProperty } from '@nestjs/swagger';
import { Customer, States, TypeAddress } from '@prisma/client';

import { BaseSwagger } from './base.swagger';

const pessoa = fakerBr.pessoa();
const endereco = pessoa.endereco;
export class CustomerSwagger extends BaseSwagger implements Customer {
  @ApiProperty({ default: pessoa.nome })
  fullName: string;

  @ApiProperty({ default: pessoa.cpf })
  cpfOrCnpj: string;

  @ApiProperty({ default: pessoa.celular })
  cellPhone: string;

  @ApiProperty()
  landline: string | null;

  @ApiProperty({ enum: TypeAddress })
  typeOfAddress: TypeAddress;

  @ApiProperty({ default: endereco.cep })
  cep: string;

  @ApiProperty({ default: endereco.logradouro })
  street: string;

  @ApiProperty({ default: endereco.numero })
  number: string;

  @ApiProperty({ default: endereco.bairro })
  district: string;

  @ApiProperty({ default: endereco.complemento })
  complement: string | null;

  @ApiProperty({ enum: States, default: endereco.estado })
  state: States;

  @ApiProperty({ default: endereco.cidade })
  city: string;
}
