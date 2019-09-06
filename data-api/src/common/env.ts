import * as envvar from 'env-var';

export default {
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'development', 'staging', 'production']),

  SERVER_PORT: envvar
    .get('SERVER_PORT')
    .required()
    .asPortNumber(),

  SERVER_HOST: envvar
    .get('SERVER_HOST')
    .required()
    .asString(),

  JWT_SECRET: envvar
    .get('JWT_SECRET')
    .required()
    .asString(),

  MONGODB_DB_NAME: envvar
    .get('MONGODB_DB_NAME')
    .required()
    .asString(),

  MONGODB_CONNECTION_STRING: envvar
    .get('MONGODB_CONNECTION_STRING')
    .required()
    .asString(),
};
