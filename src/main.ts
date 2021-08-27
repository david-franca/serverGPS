import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Environments } from './interfaces';
import { PropagatorService } from './propagator/propagator.service';
import { StateIoAdapter } from './state/state.adapter';
import { StateService } from './state/state.service';
import { ExceptionsLoggerFilter, NotFoundExceptionFilter } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService: ConfigService<Record<Environments, any>> =
    app.get(ConfigService);
  const stateService = app.get(StateService);
  const propagatorService = app.get(PropagatorService);
  app.enableCors({
    credentials: true,
    origin: configService.get('CORS_HOST').split(', '),
  });
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new ExceptionsLoggerFilter(httpAdapter),
    new NotFoundExceptionFilter(),
  );
  app.useWebSocketAdapter(
    new StateIoAdapter(app, stateService, propagatorService),
  );
  await app.listen(3001);
}
bootstrap();
