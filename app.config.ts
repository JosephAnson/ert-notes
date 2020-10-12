import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import env from 'dotenv';
env.config();

const isProduction = process.env.NODE_ENV === 'production';

const typeorm: PostgresConnectionOptions = {
  type: 'postgres',
  url:
    process.env.DATABASE_URL ||
    'postgres://postgres:admin@localhost:5433/ert-server',
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  logging: true,
  synchronize: !isProduction,
  extra: isProduction
    ? {
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {}
};

const config = {
  production: isProduction,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  typeorm
};

export default config;
