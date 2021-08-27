import { Response } from 'express';
import * as path from 'path';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const pathToHtml = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'html',
      'index.html',
    );

    response.sendFile(pathToHtml);
  }
}
