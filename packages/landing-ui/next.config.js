const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['lodash-es']);

const config = {
  env: {
    // These are replaced at build time, so you can access them in your code using `process.env.*`
    // We cannot pass NODE_ENV as it is handled by nextjs and gives an error if passed.
    ANALYTICS_TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
  },
};

module.exports = withPlugins([[withTM]], config);
