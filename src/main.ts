import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/defaults';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule.forRoot({
      config,
    }),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));
  app.listen(3001);
}
bootstrap();
