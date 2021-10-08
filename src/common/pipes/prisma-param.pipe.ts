import { isJSON, isNumberString } from 'class-validator';

import {
  ArgumentMetadata,
  BadGatewayException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { object, string, number } from '@hapi/joi';

@Injectable()
export class PrismaParamPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    const schema = object({
      orderBy: string().optional(),
      where: string().optional(),
      skip: number().optional(),
      take: number().optional(),
      cursor: string().optional(),
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
