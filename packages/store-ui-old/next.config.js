const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withTM = require('next-transpile-modules')(['lodash-es']);

const config = {
  env: {
    // These are replaced at build time, so you can access them in your code using `process.env.*`
    // We cannot pass NODE_ENV as it is handled by nextjs and gives an error if passed.
    PORT: process.env.PORT,

    // We include these so the required envvar checks don't fail at build time
    API_ENDPOINT: 'mock',
    ARTIFACTS_ENDPOINT: 'mock',
    IMAGES_PROXY_ENDPOINT: 'mock',
    NESTPAY_GATEWAY_ENDPOINT: 'mock',
  },

  // Using config makes it incompatible with static resource optimization, see https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  // These are only available when doing SSR.
  serverRuntimeConfig: {},

  // These are available both to client and server.
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    ARTIFACTS_ENDPOINT: process.env.ARTIFACTS_ENDPOINT,
    IMAGES_PROXY_ENDPOINT: process.env.IMAGES_PROXY_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
    ANALYTICS_TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
    NESTPAY_GATEWAY_ENDPOINT: process.env.NESTPAY_GATEWAY_ENDPOINT,
  },
};

module.exports = withPlugins(
  [
    [
      withBundleAnalyzer,
      {
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(
          process.env.BUNDLE_ANALYZE,
        ),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      },
    ],
    [withTM],
  ],
  config,
);
