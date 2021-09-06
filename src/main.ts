import * as compression from 'compression';
import * as createRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as passport from 'passport';
import { createClient } from 'redis';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { winstonConfig } from './config/winston.config';
import { Environments } from './interfaces';
import { PropagatorService } from './propagator/propagator.service';
import { StateIoAdapter } from './state/state.adapter';
import { StateService } from './state/state.service';
import { ExceptionsLoggerFilter, NotFoundExceptionFilter } from './utils';
import { swaggerConfig } from './config';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService: ConfigService<Record<Environments, any>> =
    app.get(ConfigService);
  const stateService = app.get(StateService);
  const propagatorService = app.get(PropagatorService);
  const RedisStore = createRedisStore(session);
  const redisClient = createClient({
    host: configService.get('REDIS_HOST'),
    port: configService.get('REDIS_PORT'),
    password: configService.get('REDIS_PASSWORD'),
  });
  const sessionOptions: session.SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    secret: configService.get('SESSION_SECRET'),
    resave: false,
    saveUninitialized: false,
    name: 'server-session',
  };
  app.enableCors({
    credentials: true,
    origin: configService.get('CORS_HOST').split(', '),
  });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  app.useWebSocketAdapter(
    new StateIoAdapter(app, stateService, propagatorService),
  );
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
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
