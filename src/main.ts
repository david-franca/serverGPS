import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(
    AppModule.forRoot({
      port: [2650, 2651, 2652],
    }),
  );
}
bootstrap();
