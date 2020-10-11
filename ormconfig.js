// eslint-disable-next-line @typescript-eslint/no-var-requires
const env = require('dotenv');
const config = require('app.config');

env.config();
console.log('Database:', config.get('typeorm').database);

const isProduction = config.get('env') === 'production';

const ormConfig = {
  // Change the next line to use the Heroku postgres from other environment like localhost, remember that heroku changes this data periodically for security reasons
  url: config.get('typeorm').database,
  type: 'postgres',
  migrationsTableName: 'migration_table',
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    migrationsDir: 'server/migrations',
    subscribersDir: 'server/subscriber'
  },
  extra: isProduction
    ? {
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {}
};

module.exports = ormConfig;
