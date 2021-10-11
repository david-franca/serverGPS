import * as Joi from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config';

export const configOptions: ConfigModuleOptions = {
  cache: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'provision')
      .default('development'),
    DATABASE_URL: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.number().required(),
    REDIS_PASSWORD: Joi.string().required(),
    SALT_NUMBER: Joi.number().required(),
    CORS_HOST: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_USER: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    SERVER_PORT: Joi.number().required(),
    SESSION_SECRET: Joi.string().required(),
    THROTTLE_TTL: Joi.number().required(),
    THROTTLE_LIMIT: Joi.number().required(),
    ADMIN_PASS: Joi.string().required(),
    SENTRY_DNS: Joi.string().required(),
  }),
};
