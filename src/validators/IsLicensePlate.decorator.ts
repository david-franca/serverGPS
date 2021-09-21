import { validateBr } from 'js-brasil';

import { generateDecorator } from '../utils';

export const IsLicensePlate = generateDecorator(
  <(value: string) => boolean>validateBr.placa,
  'IsLicensePlate',
  '$property must be a valid license plate',
);
