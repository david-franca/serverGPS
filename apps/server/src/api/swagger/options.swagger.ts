import { Type } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';

export const options = (
  name: string,
  method: 'GET' | 'POST' | 'PATCH' | 'GETBYID' | 'DELETE',
  type?: Type<unknown>,
): ApiResponseOptions => {
  const titleCapitalized = name.charAt(0).toUpperCase() + name.substring(1);
  let description = '';
  let isArray = false;

  switch (method) {
    case 'GET':
      description = `Returns all ${name} in array.`;
      isArray = true;
      break;

    case 'POST':
      description = `Creates ${name} in database.`;
      break;

    case 'PATCH':
      description = `Returns ${name} updated.`;
      break;

    case 'GETBYID':
      description = `Returns single ${name} by id.`;
      break;

    case 'DELETE':
      description = `No content return. ${titleCapitalized} successfully removed.`;
      break;
  }
  return { type, description, isArray };
};
