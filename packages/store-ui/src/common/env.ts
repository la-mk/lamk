import { from } from 'env-var';

// We have to assign all process.env to a separate variable first, because NextJS runs a babel transform that looks for `process.env` in the code and replaces it with the environment variables.

const vars = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
};

const envvar = from(vars as any);

export default {
  HOST: envvar
    .get('HOST')
    .required()
    .asString(),

  PORT: envvar
    .get('PORT')
    .required()
    .asPortNumber(),
};
