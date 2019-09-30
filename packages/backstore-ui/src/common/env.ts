import * as envvar from 'env-var';

export default {
  // This is pre-defined by CRA and cannot be changed
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'development', 'production']),

  // Except for NODE_ENV, CRA demands that all envvars start with REACT_APP_*
  API_HOST: envvar
    .get('REACT_APP_API_HOST')
    .required()
    .asString(),

  API_PORT: envvar
    .get('REACT_APP_API_PORT')
    .required()
    .asPortNumber(),
};
