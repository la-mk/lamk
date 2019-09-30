import * as envvar from 'env-var';

export default {
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'development', 'staging', 'production']),

  API_HOST: envvar
    .get('API_HOST')
    .required()
    .asString(),

  API_PORT: envvar
    .get('API_PORT')
    .required()
    .asPortNumber(),
};
