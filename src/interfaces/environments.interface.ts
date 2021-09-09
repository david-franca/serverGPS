export type Environments =
  | 'DATABASE_URL'
  | 'JWT_ACCESS_TOKEN_PRIVATE_KEY'
  | 'JWT_ACCESS_TOKEN_PUBLIC_KEY'
  | 'JWT_ACCESS_TOKEN_EXPIRATION_TIME'
  | 'JWT_REFRESH_TOKEN_PRIVATE_KEY'
  | 'JWT_REFRESH_TOKEN_PUBLIC_KEY'
  | 'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
  | 'REDIS_HOST'
  | 'REDIS_PORT'
  | 'REDIS_PASSWORD'
  | 'SALT_NUMBER'
  | 'EMAIL_HOST'
  | 'EMAIL_USER'
  | 'EMAIL_PASSWORD'
  | 'EMAIL_PORT'
  | 'CORS_HOST'
  | 'SERVER_PORT'
  | 'SESSION_SECRET'
  | 'THROTTLE_TTL'
  | 'THROTTLE_LIMIT'
  | 'ADMIN_PASS';
