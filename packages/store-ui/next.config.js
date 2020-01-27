const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withLess = require('@zeit/next-less');

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.less'] = file => {};
}

const config = {
  env: {
    // These are replaced at build time, so you can access them in your code using `process.env.*`
    // We cannot pass NODE_ENV as it is handled by nextjs and gives an error if passed.
    PORT: process.env.PORT,

    // We include these so the required envvar checks don't fail at build time
    API_ENDPOINT: 'mock',
    ARTIFACTS_ENDPOINT: 'mock',
  },

  // Using config makes it incompatible with static resource optimization, see https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  // These are only available when doing SSR.
  serverRuntimeConfig: {},

  // These are available both to client and server.
  publicRuntimeConfig: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    ARTIFACTS_ENDPOINT: process.env.ARTIFACTS_ENDPOINT,
    NODE_ENV: process.env.NODE_ENV,
    ANALYTICS_TRACKING_ID: process.env.ANALYTICS_TRACKING_ID,
  },
};

module.exports = withPlugins(
  [
    [
      withLess,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: {
            '@heading-1-size': '34px',
            '@heading-2-size': '26px',
            '@heading-3-size': '20px',
            '@heading-4-size': '16px',
          },
        },
      },
    ],
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
  ],
  config,
);
