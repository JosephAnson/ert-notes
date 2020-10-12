import { ConnectionOptions } from 'typeorm';
import config from 'app.config';

const ormconfig: ConnectionOptions = {
  // Change the next line to use the Heroku postgres from other environment like localhost, remember that heroku changes this data periodically for security reasons
  url: config.typeorm.url,
  type: config.typeorm.type,
  migrationsTableName: 'migration_table',
  migrations: ['dist/migrations/**/*.js'],
  subscribers: ['dist/subscriber/**/*.js'],
  cli: {
    migrationsDir: 'server/migrations',
    subscribersDir: 'server/subscriber'
  },
  extra: config.typeorm.extra
};

module.exports = ormconfig;
