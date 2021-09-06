import { validateBr } from 'js-brasil';

import { generateDecorator } from '../utils';

export const IsCPFOrCNPJ = generateDecorator(
  <(value: string) => boolean>validateBr.cpfcnpj,
  'isCPFOrCNPJ',
  '$property must be a valid CPF or CNPJ',
);
