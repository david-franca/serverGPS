import { validateBr } from 'js-brasil';

import { generateDecorator } from '../utils';

export const IsRenavam = generateDecorator(
  <(value: string) => boolean>validateBr.renavam,
  'IsRenavam',
  '$property must be a valid renavam',
);
