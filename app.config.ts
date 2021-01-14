import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const typeorm: PostgresConnectionOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
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
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  host: process.env.HOST,
  typeorm
};

export default config;
