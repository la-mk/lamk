import { from } from 'env-var';

// Except for NODE_ENV, CRA demands that all envvars start with REACT_APP_*
// We have to assign all process.env to a separate variable first, because during build process.env.* is replaced with its value.
const vars = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_ENDPOINT:
    process.env.REACT_APP_API_ENDPOINT || 'http://api.dev.sradevski.com',
  PORT: process.env.REACT_APP_PORT || 80,
};

const envvar = from(vars as any);

export default {
  // This is pre-defined by CRA and cannot be changed
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'staging', 'development', 'production']),

  API_ENDPOINT: envvar
    .get('API_ENDPOINT')
    .required()
    .asString(),

  PORT: envvar
    .get('PORT')
    .required()
    .asPortNumber(),
};
