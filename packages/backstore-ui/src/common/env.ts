import * as envvar from 'env-var';

export default {
  // This is pre-defined by CRA and cannot be changed
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'development', 'production']),

  // Except for NODE_ENV, CRA demands that all envvars start with REACT_APP_*
  HOST: envvar
    .get('REACT_APP_HOST')
    .required()
    .asString(),

  PORT: envvar
    .get('REACT_APP_PORT')
    .required()
    .asPortNumber(),
};
