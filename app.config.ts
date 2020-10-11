import convict from 'convict';
import convictFormat from 'convict-format-with-validator';

convict.addFormat(convictFormat.url);

const isProduction = process.env.NODE_ENV === 'production';

const schema: convict.Schema<any> = {
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    arg: 'port'
  },
  host: {
    doc: 'The host to bind.',
    format: 'url',
    default: 'localhost',
    arg: 'HOST'
  },
  typeorm: {
    type: {
      default: 'postgres',
      env: 'DATABASE_URL'
    },
    url: {
      default: 'postgres://postgres:admin@localhost:5433/bbb-server',
      env: 'DATABASE_URL'
    },
    synchronize: {
      default: !isProduction,
      format: Boolean
    },
    logging: {
      default: true,
      format: Boolean
    },
    migrations: {
      default: ['dist/migrations/**/*.js']
    },
    subscribers: {
      default: ['dist/subscriber/**/*.js']
    },
    extra: {
      default: isProduction
        ? {
            ssl: {
              rejectUnauthorized: false
            }
          }
        : {}
    }
  }
};

export const config = convict(schema).validate();

export type Config = Record<keyof typeof schema, any>;

export default config;
