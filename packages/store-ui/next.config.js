const withPlugins = require('next-compose-plugins');

const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const withLess = require('@zeit/next-less');
const withTM = require('next-transpile-modules')(['lodash-es']);

const config = {
  env: {
    // These are replaced at build time, so you can access them in your code using `process.env.*`
    // We cannot pass NODE_ENV as it is handled by nextjs and gives an error if passed.
    PORT: process.env.PORT,

    // We include these so the required envvar checks don't fail at build time
    API_ENDPOINT: 'mock',
    ARTIFACTS_ENDPOINT: 'mock',
    NESTPAY_GATEWAY_ENDPOINT: 'mock',
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
    NESTPAY_GATEWAY_ENDPOINT: process.env.NESTPAY_GATEWAY_ENDPOINT,
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
            '@font-family': `
            'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
            `,
            '@table-header-bg': '#ffffff',
            '@height-base': '36px',
            '@height-lg': '46px',
            '@height-sm': '24px',
            '@form-item-margin-bottom': '12px',
            '@select-single-item-height-lg': '46px',
            '@border-radius-base': '6px',
            '@form-vertical-label-padding': '0',
          },
        },
        webpack: (config, { isServer }) => {
          if (isServer) {
            const antStyles = /antd\/.*?\/style.*?/;
            const origExternals = [...config.externals];
            config.externals = [
              (context, request, callback) => {
                if (request.match(antStyles)) return callback();
                if (typeof origExternals[0] === 'function') {
                  origExternals[0](context, request, callback);
                } else {
                  callback();
                }
              },
              ...(typeof origExternals[0] === 'function' ? [] : origExternals),
            ];

            config.module.rules.unshift({
              test: antStyles,
              use: 'null-loader',
            });
          }
          return config;
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
    [withTM],
  ],
  config,
);
