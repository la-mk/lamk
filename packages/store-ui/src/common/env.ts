import { from } from 'env-var';

// We have to assign all process.env to a separate variable first, because NextJS runs a babel transform that looks for `process.env` in the code and replaces it with the environment variables.
const vars = {
  API_ENDPOINT: process.env.API_ENDPOINT || 'http://api.dev.sradevski.com',
  PORT: process.env.PORT || 80,
};

const envvar = from(vars as any);

export default {
  API_ENDPOINT: envvar
    .get('API_ENDPOINT')
    .required()
    .asString(),

  PORT: envvar
    .get('PORT')
    .required()
    .asPortNumber(),
};
