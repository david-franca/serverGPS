import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('APV API')
  .setDescription('Server api')
  .setVersion('1.0')
  .build();
