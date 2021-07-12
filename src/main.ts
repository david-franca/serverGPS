import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import * as def from './config/defaults';

async function bootstrap() {
  await NestFactory.createApplicationContext(
    AppModule.forRoot({
      port: new ConfigService({ defaults: def }).get('port'),
    }),
  );
}
bootstrap();
