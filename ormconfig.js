/***
 * Don't change this file!
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('dotenv');
env.config();

const ormConfig = {
  // Change the next line to use the Heroku postgres from other environment like localhost, remember that heroku changes this data periodically for security reasons
  url: process.env.DATABASE_URL,
  type: 'postgres',
  migrationsTableName: 'migration_table',
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    migrationsDir: 'server/migrations',
    subscribersDir: 'server/subscriber'
  },
  extra:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            rejectUnauthorized: false
          }
        }
      : {}
};

module.exports = ormConfig;
