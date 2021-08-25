import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as helmet from 'helmet';
import { ExceptionsLoggerFilter, NotFoundExceptionFilter } from './utils';
import { ConfigService } from '@nestjs/config';
import { RedisIoAdapter } from './adapters/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: configService.get<string>('CORS_HOST').split(', '),
  });
  app.useGlobalFilters(
    new ExceptionsLoggerFilter(httpAdapter),
    new NotFoundExceptionFilter(),
  );
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      transform: true,
    }),
  );
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.listen(3001);
}
bootstrap();
