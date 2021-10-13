import { isJSON, isNumberString } from 'class-validator';

import * as Joi from '@hapi/joi';
import {
  ArgumentMetadata,
  BadGatewayException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class PrismaParamPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const schema = Joi.object({
      orderBy: Joi.string().optional(),
      where: Joi.string().optional(),
      skip: Joi.number().optional(),
      take: Joi.number().optional(),
      cursor: Joi.string().optional(),
    });

    const { error } = schema.validate(value);

    if (error) {
      throw new BadGatewayException(`Parameter ${error.message}`);
    }

    const keys = Object.keys(value);
    keys.includes('orderBy' || 'where' || 'skip' || 'take' || 'cursor');
    keys.forEach((key) => {
      value[key] = transform(value[key]);
    });
    return value;
  }
}
const transform = (value: string) => {
  if (isJSON(value)) {
    return JSON.parse(value);
  }
  if (isNumberString(value, { no_symbols: true })) {
    return parseInt(value);
  }
};
