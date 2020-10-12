const config = require('app.config');

require('dotenv').config();

console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log("HEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRRRRRRRRRREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
console.log(config.typeorm.url);

const ormconfig = {
  // Change the next line to use the Heroku postgres from other environment like localhost, remember that heroku changes this data periodically for security reasons
  url: config.typeorm.url,
  type: config.typeorm.type,
  migrationsTableName: 'migration_table',
  migrations: config.typeorm.migrations,
  subscribers: config.typeorm.subscribers,
  cli: {
    migrationsDir: 'server/migrations',
    subscribersDir: 'server/subscriber'
  },
  extra: config.typeorm.extra
};

module.exports = ormconfig;
