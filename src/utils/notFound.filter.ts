import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';

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
