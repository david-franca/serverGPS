import { hash } from 'bcrypt';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { WinstonModule } from 'nest-winston';

import { ExceptionsLoggerFilter, swaggerConfig, winstonConfig } from '@common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { Environments } from '@types';

import { AppModule } from './app.module';
import { PrismaService } from './modules/prisma/prisma.service';

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

  // Cors
  app.enableCors();

  // Swagger Api
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1', app, document, {
    customSiteTitle: 'Docs APV API',
    swaggerOptions: { supportedSubmitMethods: [], persistAuthorization: true },
  });

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

  // Middleware
  app.use(cookieParser());
  app.use(helmet());
  app.use(compression());
  await app.listen(configService.get('SERVER_PORT'));
}
bootstrap();
