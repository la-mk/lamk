import { from } from 'env-var';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// These are frontend-only envvars. The server has additional environment variables , such as PORT, that might be required, but are accessed directly. See `server/index.ts for details.

const vars = {
  // We also check process env as it is set to a mock value so the build succeeds.
  API_ENDPOINT: publicRuntimeConfig.API_ENDPOINT || process.env.API_ENDPOINT,
  ARTIFACTS_ENDPOINT:
    publicRuntimeConfig.ARTIFACTS_ENDPOINT || process.env.ARTIFACTS_ENDPOINT,
  IMAGES_PROXY_ENDPOINT:
    publicRuntimeConfig.IMAGES_PROXY_ENDPOINT ||
    process.env.IMAGES_PROXY_ENDPOINT,
  ANALYTICS_TRACKING_ID:
    publicRuntimeConfig.ANALYTICS_TRACKING_ID ||
    process.env.ANALYTICS_TRACKING_ID,
  NODE_ENV: publicRuntimeConfig.NODE_ENV || process.env.NODE_ENV,
  NESTPAY_GATEWAY_ENDPOINT:
    publicRuntimeConfig.NESTPAY_GATEWAY_ENDPOINT ||
    process.env.NESTPAY_GATEWAY_ENDPOINT,
};

const envvar = from(vars as any);

export default {
  API_ENDPOINT: envvar.get('API_ENDPOINT').required().asString(),

  ARTIFACTS_ENDPOINT: envvar.get('ARTIFACTS_ENDPOINT').required().asString(),

  IMAGES_PROXY_ENDPOINT: envvar
    .get('IMAGES_PROXY_ENDPOINT')
    .required()
    .asString(),

  ANALYTICS_TRACKING_ID: envvar.get('ANALYTICS_TRACKING_ID').asString(),

  NODE_ENV: envvar
    .get('NODE_ENV')
    .required()
    .asEnum(['development', 'production']),

  NESTPAY_GATEWAY_ENDPOINT: envvar
    .get('NESTPAY_GATEWAY_ENDPOINT')
    .required()
    .asString(),
};
