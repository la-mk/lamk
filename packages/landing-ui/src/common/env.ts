import { from } from 'env-var';

const vars = {
  NODE_ENV: process.env.NODE_ENV,
  ANALYTICS_TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
};

const envvar = from(vars as any);

export default {
  ANALYTICS_TRACKING_ID: envvar.get('ANALYTICS_TRACKING_ID').asString(),
  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['development', 'production']),
};
