import { fakerBr } from 'js-brasil';

import { ApiProperty } from '@nestjs/swagger';
import { Customer, States, TypeAddress } from '@prisma/client';

import { BaseSwagger } from './base.swagger';

const pessoa = fakerBr.pessoa();
const endereco = pessoa.endereco;
export class CustomerSwagger extends BaseSwagger implements Customer {
  @ApiProperty({ example: pessoa.nome })
  fullName: string;

  @ApiProperty({ example: pessoa.cpf })
  cpfOrCnpj: string;

  @ApiProperty({ example: '85996682594' })
  cellPhone: string;

  @ApiProperty({ example: '8533421352' })
  landline: string | null;

  @ApiProperty({ enum: TypeAddress })
  typeOfAddress: TypeAddress;

  @ApiProperty({ example: endereco.cep })
  cep: string;

  @ApiProperty({ example: endereco.logradouro })
  street: string;

  @ApiProperty({ example: endereco.numero })
  number: string;

  @ApiProperty({ example: endereco.bairro })
  district: string;

  @ApiProperty({
    default: endereco.complemento,
    nullable: true,
    required: false,
  })
  complement: string | null;

  @ApiProperty({ enum: States, default: endereco.estado })
  state: States;

  @ApiProperty({ example: endereco.cidade })
  city: string;
}
