import { validateBr } from 'js-brasil';

import { generateDecorator } from '../utils';

export const IsChassi = generateDecorator(
  <(value: string) => boolean>validateBr.chassi,
  'IsChassi',
  '$property must be a valid chassi',
);
