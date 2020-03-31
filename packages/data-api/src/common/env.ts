import * as _ from 'lodash';
import * as envvar from 'env-var';
const loadEnv = _.once(() => {
  return {
    NODE_ENV: envvar
      .get('NODE_ENV')
      .required()
      .asEnum(['test', 'development', 'staging', 'production']),

    PORT: envvar
      .get('PORT')
      .required()
      .asPortNumber(),

    HOST: envvar
      .get('HOST')
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

    STORAGE_ENDPOINT: envvar
      .get('STORAGE_ENDPOINT')
      .required()
      .asString(),

    STORAGE_BUCKET_NAME: envvar
      .get('STORAGE_BUCKET_NAME')
      .required()
      .asString(),

    STORAGE_ACCESS_KEY_ID: envvar
      .get('STORAGE_ACCESS_KEY_ID')
      .required()
      .asString(),

    STORAGE_ACCESS_KEY_SECRET: envvar
      .get('STORAGE_ACCESS_KEY_SECRET')
      .required()
      .asString(),

    MAIL_SERVICE_API_KEY: envvar
      .get('MAIL_SERVICE_API_KEY')
      .required()
      .asString(),

    SEARCH_SERVICE_ENDPOINT: envvar
      .get('SEARCH_SERVICE_ENDPOINT')
      .required()
      .asString(),

    SEARCH_SERVICE_API_KEY: envvar
      .get('SEARCH_SERVICE_API_KEY')
      .required()
      .asString(),

    NESTPAY_API_ENDPOINT: envvar
      .get('NESTPAY_API_ENDPOINT')
      .required()
      .asString(),
  };
});

export default loadEnv;
