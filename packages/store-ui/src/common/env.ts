import { from } from 'env-var';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

// These are frontend-only envvars. The server has additional environment variables , such as PORT, that might be required, but are accessed directly. See `server/index.ts for details.

const vars = {
  // We also check process env as it is set to a mock value so the build succeeds.
  API_ENDPOINT: publicRuntimeConfig.API_ENDPOINT || process.env.API_ENDPOINT,
  ARTIFACTS_ENDPOINT:
    publicRuntimeConfig.ARTIFACTS_ENDPOINT || process.env.API_ENDPOINT,
};

const envvar = from(vars as any);

export default {
  API_ENDPOINT: envvar
    .get('API_ENDPOINT')
    .required()
    .asString(),

  ARTIFACTS_ENDPOINT: envvar
    .get('ARTIFACTS_ENDPOINT')
    .required()
    .asString(),
};
