import { config } from 'dotenv';

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

if (!isDevelopment) {
  const pathToEnv = __dirname + '/../.env';
  config({ path: pathToEnv });
} else {
  config();
}

const serverConfig = {
  port: process.env.PORT || 5000,
  saltRounds:
    (process.env.SALT_ROUNDS && Number(process.env.SALT_ROUNDS)) || 10,

  jwtSecret: process.env.JWT_SECRET || 'secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '5m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  cookieSecret: process.env.COOKIE_SECRET || 'secret',
  cookieMaxAge:
    (process.env.SALT_ROUNDS && Number(process.env.COOKIE_MAX_AGE)) ||
    1000 * 60 * 5, // 5 minutes in milliseconds
  cookieRefreshMaxAge:
    (process.env.SALT_ROUNDS && Number(process.env.COOKIE_REFRESH_MAX_AGE)) ||
    1000 * 60 * 60 * 24 * 30, // 1 month in milliseconds

  isProduction: process.env.NODE_ENV === 'production',

  database: {
    type: process.env.DB_TYPE || 'postgres',
    database: process.env.DB_NAME || 'chess-backend',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    ssl: process.env.DB_SSL === 'true',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },

  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default serverConfig;
