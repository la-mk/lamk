const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withTM = require('next-transpile-modules')(['lodash-es']);

const config = {};

module.exports = withPlugins(
  [
    [
      withLess,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: {
            'height-base': '42px',
            'height-lg': '50px',
            'height-sm': '30px',
            '@form-item-margin-bottom': '32px',
            '@font-size-base': '16px',
            '@heading-1-size': '40px',
            '@heading-2-size': '32px',
            '@heading-3-size': '24px',
            '@heading-4-size': '20px',
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
