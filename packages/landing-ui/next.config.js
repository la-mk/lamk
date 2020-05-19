const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withTM = require('next-transpile-modules')(['lodash-es']);

const config = {
  env: {
    // These are replaced at build time, so you can access them in your code using `process.env.*`
    // We cannot pass NODE_ENV as it is handled by nextjs and gives an error if passed.
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
            '@font-family': `
              'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
            `,
            'height-base': '42px',
            'height-lg': '50px',
            'height-sm': '30px',
            '@form-item-margin-bottom': '32px',
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
    [withTM],
  ],
  config,
);
