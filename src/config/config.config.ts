import { number, object, string } from '@hapi/joi';
import { ConfigModuleOptions } from '@nestjs/config';

export const configOptions: ConfigModuleOptions = {
  validationSchema: object({
    DATABASE_URL: string().required(),
    JWT_REFRESH_TOKEN_PRIVATE_KEY: string().required(),
    JWT_REFRESH_TOKEN_PUBLIC_KEY: string().required(),
    JWT_REFRESH_TOKEN_EXPIRATION_TIME: number().required(),
    JWT_ACCESS_TOKEN_PRIVATE_KEY: string().required(),
    JWT_ACCESS_TOKEN_PUBLIC_KEY: string().required(),
    JWT_ACCESS_TOKEN_EXPIRATION_TIME: number().required(),
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
  }),
};
