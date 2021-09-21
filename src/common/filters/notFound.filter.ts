import { Response } from 'express';
import { resolve } from 'path';

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

    const pathToHtml = resolve(
      __dirname,
      '..',
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
