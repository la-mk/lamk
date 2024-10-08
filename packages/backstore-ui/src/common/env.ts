import { from } from 'env-var';

// Except for NODE_ENV, CRA demands that all envvars start with REACT_APP_*, if you wish to use some during build time.
// For development, we access them from the process, but in production, they are injected at runtime in index.html
// We have to assign all process.env to a separate variable first, because during build process.env.* is replaced with its value.
const vars = {
  // This is specified during build time, so we read from process.env
  NODE_ENV: process.env.NODE_ENV || 'development',

  // @ts-ignore
  API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || window._env.API_ENDPOINT,

  ARTIFACTS_ENDPOINT:
    // @ts-ignore
    process.env.REACT_APP_ARTIFACTS_ENDPOINT || window._env.ARTIFACTS_ENDPOINT,

  IMAGES_PROXY_ENDPOINT:
    // @ts-ignore
    process.env.REACT_APP_IMAGES_PROXY_ENDPOINT ||
    // @ts-ignore
    window._env.IMAGES_PROXY_ENDPOINT,

  ENABLE_SIGNUP:
    // @ts-ignore
    process.env.REACT_APP_ENABLE_SIGNUP || window._env.ENABLE_SIGNUP,
};

const envvar = from(vars as any);

export const env = {
  // This is pre-defined by CRA and cannot be changed
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['test', 'development', 'production']),

  API_ENDPOINT: envvar.get('API_ENDPOINT').required().asString(),

  ARTIFACTS_ENDPOINT: envvar.get('ARTIFACTS_ENDPOINT').required().asString(),

  IMAGES_PROXY_ENDPOINT: envvar
    .get('IMAGES_PROXY_ENDPOINT')
    .required()
    .asString(),

  ENABLE_SIGNUP: envvar.get('ENABLE_SIGNUP').required().asBool(),
};
