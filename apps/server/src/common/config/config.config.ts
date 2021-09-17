import { number, object, string } from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config';

export const configOptions: ConfigModuleOptions = {
  cache: true,
  validationSchema: object({
    NODE_ENV: string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    DATABASE_URL: string().required(),
    REDIS_HOST: string().required(),
    REDIS_PORT: number().required(),
    REDIS_PASSWORD: string().required(),
    SALT_NUMBER: number().required(),
    CORS_HOST: string().required(),
    EMAIL_HOST: string().required(),
    EMAIL_USER: string().required(),
    EMAIL_PASSWORD: string().required(),
    EMAIL_PORT: number().required(),
    SERVER_PORT: number().required(),
    SESSION_SECRET: string().required(),
    THROTTLE_TTL: number().required(),
    THROTTLE_LIMIT: number().required(),
    ADMIN_PASS: string().required(),
    SENTRY_DNS: string().required(),
    RABBITMQ_USER: string().required(),
    RABBITMQ_PASSWORD: string().required(),
    RABBITMQ_HOST: string().required(),
  }),
};
