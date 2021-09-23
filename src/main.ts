import { hash } from 'bcrypt';
import * as compression from 'compression';
import * as createRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import * as passport from 'passport';
import { createClient } from 'redis';

import { ExceptionsLoggerFilter, swaggerConfig, winstonConfig } from '@common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { Environments } from '@types';

import { AppModule } from './app.module';
import { PrismaService } from './modules/prisma/prisma.service';
import { StateIoAdapter } from './modules/state/state.adapter';
import { StateService } from './modules/state/state.service';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonConfig);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger,
  });

  // Validations
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));

  const prismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  const configService: ConfigService<Record<Environments, any>> =
    app.get(ConfigService);
  Sentry.init({
    dsn: configService.get('SENTRY_DNS'),
    integrations: [new Sentry.Integrations.Http({ tracing: true })],
    tracesSampleRate: 1.0,
  });

  // Redis Cache
  const stateService = app.get(StateService);

  // Cors
  app.enableCors({
    credentials: true,
    origin: configService.get('CORS_HOST').split(', '),
  });

  // Swagger Api
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1', app, document, {
    customSiteTitle: 'Docs APV API',
    swaggerOptions: { supportedSubmitMethods: [], persistAuthorization: true },
  });

  const RedisStore = createRedisStore(session);
  const count = await prismaService.user.count();

  if (!count) {
    const admin = await prismaService.user.create({
      data: {
        name: 'admin',
        username: 'admin',
        password: await hash(
          configService.get('ADMIN_PASS'),
          configService.get('SALT_NUMBER'),
        ),
        role: 'ADMIN',
      },
    });
    logger.log(`Created admin user with ${admin.id} id`, 'Main');
  }
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

  // Middleware
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  app.use(Sentry.Handlers.errorHandler());
  app.useWebSocketAdapter(new StateIoAdapter(app, stateService));
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
